import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getUserId } from "@/lib/get-user-id";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { amount, planType, addOnServices } = await req.json();

    console.log("Payment Request:", { amount, planType, addOnServices, userId: userId });

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount. Must be greater than 0." }, { status: 400 });
    }


    // 0. Fetch user email for Stripe
    // First try to get the email from onboarding details
    const onboardingDetails = await prisma.onboardingYourDetails.findUnique({
      where: { userId: userId },
      select: { email: true }
    });

    const accountUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    const receiptEmail = onboardingDetails?.email || accountUser?.email;

    // 1. Create a PaymentIntent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      receipt_email: receiptEmail,
      metadata: {
        userId: userId,
        planType,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // 2. Save a pending payment record in the database
    await prisma.payment.create({
      data: {
        userId: userId,
        stripePaymentIntentId: paymentIntent.id,
        amount: Math.round(amount * 100),
        currency: "usd",
        status: "pending",
        planType,
      },
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Stripe Payment Intent Error Details:", {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      statusCode: error.statusCode
    });

    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!payment) {
      return NextResponse.json({ message: "No payment found" }, { status: 404 });
    }

    // Fetch receipt URL from Stripe
    let receiptUrl = null;
    try {
      const stripeIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId, {
        expand: ['latest_charge'],
      });
      const charge = stripeIntent.latest_charge as any;
      receiptUrl = charge?.receipt_url;
    } catch (e) {
      console.error("Error fetching stripe receipt:", e);
    }

    // Fetch user details for receipt
    const userDetails = await prisma.onboardingYourDetails.findUnique({
      where: { userId: userId },
      select: { fullName: true, email: true }
    });

    const accountUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    const receiptEmail = userDetails?.email || accountUser?.email;

    // Fetch additional details for detailed invoice (State and Add-ons)
    const [selectPlan, starterPlan, premiumPlan, manageBusiness, manageCategory] = await Promise.all([
      prisma.onboardingSelectPlan.findUnique({ where: { userId: userId } }),
      prisma.onboardingStarterPlan.findUnique({ where: { userId: userId } }),
      prisma.onboardingPremiumPlan.findUnique({ where: { userId: userId } }),
      prisma.onboardingManageBusiness.findUnique({ where: { userId: userId } }),
      prisma.onboardingCategory.findUnique({ where: { userId: userId } })
    ]);

    // Fix for duplicate add-ons: only fetch from the relevant plan table
    let addOnServices: string[] = [];
    if (selectPlan?.plan === 'starter') {
      addOnServices = starterPlan?.addOnServices || [];
    } else if (selectPlan?.plan === 'premium') {
      addOnServices = premiumPlan?.addOnServices || [];
    } else if (manageCategory?.category) {
      addOnServices = manageCategory?.selectedServices || [];
    } else {
      // Fallback: merge if plan is undefined (should not happen in normal flow)
      addOnServices = [
        ...(starterPlan?.addOnServices || []),
        ...(premiumPlan?.addOnServices || []),
        ...(manageCategory?.selectedServices || [])
      ];
      // Remove duplicates
      addOnServices = Array.from(new Set(addOnServices));
    }
    const formationState = selectPlan?.state || manageBusiness?.state || "";

    return NextResponse.json({
      ...payment,
      receiptUrl,
      receiptEmail,
      customerName: userDetails?.fullName || manageBusiness?.fullName || "Valued Customer",
      formationState,
      addOnServices,
      manageCategory: manageCategory?.category // Title from the manage flow
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { paymentIntentId, status, billingAddress, city, zipCode } = await req.json();

    const updatedPayment = await prisma.payment.update({
      where: {
        stripePaymentIntentId: paymentIntentId,
      },
      data: {
        status: status,
        billingAddress,
        city,
        zipCode,
      },
    });

    if (status === "succeeded") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
      });
      
      const identifier = user?.name || user?.email || "A new user";
      
      await prisma.notification.create({
        data: {
          type: "NEW_USER",
          message: `${identifier} has successfully completed the onboarding.`,
        }
      });
    }

    return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

