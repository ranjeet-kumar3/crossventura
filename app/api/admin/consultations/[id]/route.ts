import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Check if admin token is present
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Fetch Consultation with deep relations
    const item = await prisma.onboardingConsultation.findUnique({
      where: { id: id },
      include: {
        user: {
          include: {
            onboardingDetails: true,
            onboardingPlan: true,
            onboardingBusinessDetails: true,
            onboardingCategory: true,
            onboardingKyc: true,
            onboardingStarter: true,
            onboardingPremium: true,
            onboardingGlobal: true,
            onboardingManageBusiness: true,
            payments: true,
          }
        }
      }
    });

    if (!item) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
    }

    const user = item.user;

    // 3. Format data for the detail page
    
    // Service Type logic
    let derivedServiceType = "Consultation";
    if (user.onboardingPlan?.plan) {
      derivedServiceType = `${user.onboardingPlan.plan.toUpperCase()} Formation`;
    } else if (user.onboardingCategory?.category === "manage your exisitng business") {
      derivedServiceType = "Business Management";
    }

    // Add-ons logic
    const serviceLabels: Record<string, string> = {
      "ein-letter": "EIN Letter",
      "virtual-mailbox": "Virtual Mailbox",
      "virtual-bank": "Virtual Bank Setup",
      "boir-filing": "BOIR Filing",
      "operating-agreement": "Operating Agreement",
      "bookkeeping": "Bookkeeping",
      "physical-address": "Physical Address",
      "google_verification": "Google Verification",
      "board_flex": "Board Flex",
      "physical_office": "Physical Office",
      "virtual_office": "Virtual Office",
      "warehousing": "Warehousing",
      "physical_bank": "Physical Bank",
      "payment_gateway": "Payment Gateway",
      "tax_guidance": "Tax Guidance"
    };

    const addons: any[] = [];
    const rawAddons = [
      ...(user.onboardingStarter?.addOnServices || []),
      ...(user.onboardingPremium?.addOnServices || []),
    ];

    const servicePrices: Record<string, string> = {
      "ein-letter": "$80",
      "virtual-mailbox": "$25/mo",
      "virtual-bank": "$100",
      "boir-filing": "$200",
      "operating-agreement": "$150",
      "bookkeeping": "$200/mo",
      "physical-address": "$200/mo"
    };

    rawAddons.forEach(s => {
      if (serviceLabels[s]) {
        addons.push({ name: serviceLabels[s], price: servicePrices[s] || "Included/Paid" });
      }
    });

    const totalAmount = user.payments.reduce((sum, p) => sum + p.amount, 0) / 100;
    // According to requirements, consultation fee is typically $49
    // If the user has made payments, we can safely assume the $49 fee is paid
    const consultationAmount = totalAmount > 0 ? 49.00 : 0;

    // Formatting for the frontend component
    const formattedItem = {
      id: item.id,
      userName: user.name || "N/A",
      email: user.email,
      phone: user.phone || "N/A",
      country: user.onboardingDetails?.country || "N/A",
      timezone: item.timezone || user.onboardingDetails?.timezone || "N/A",
      status: item.status,
      date: item.date || "N/A",
      time: item.time || "N/A",
      
      plan: user.onboardingPlan?.plan || "N/A",
      price: user.onboardingPlan?.plan === 'starter' ? '$249' : user.onboardingPlan?.plan === 'premium' ? '$849' : 'Custom',
      entityType: user.onboardingBusinessDetails?.entityType || "N/A",
      addons: addons,

      businessName: user.onboardingBusinessDetails?.businessName || user.onboardingManageBusiness?.businessName || "N/A",
      category: user.onboardingCategory?.category || "N/A",
      members: user.onboardingBusinessDetails?.numMembers?.toString() || "N/A",
      address: user.onboardingBusinessDetails?.businessAddress || "N/A",
      
      totalPaid: `$${totalAmount.toFixed(2)}`,
      consultationPrice: consultationAmount > 0 ? `$${consultationAmount.toFixed(2)}` : "Paid",
      
      documents: [
        { name: "Passport", status: user.onboardingKyc?.passportUrl ? "Uploaded" : "Pending" },
        { name: "PAN Card", status: user.onboardingKyc?.panCardUrl ? "Uploaded" : "Pending" },
        { name: "Aadhaar Card", status: user.onboardingKyc?.aadhaarCardUrl ? "Uploaded" : "Pending" },
        { name: "Address Proof", status: user.onboardingKyc?.addressProofUrl ? "Uploaded" : "Pending" },
        { name: "Driving License", status: user.onboardingKyc?.drivingLicenseUrl ? "Uploaded" : "Pending" },
        { name: "Utility Bill", status: user.onboardingKyc?.utilityBillUrl ? "Uploaded" : "Pending" },
      ].filter(doc => doc.status === "Uploaded" || true), // Show all for now
      
      serviceType: derivedServiceType
    };

    return NextResponse.json(formattedItem);

  } catch (error: any) {
    console.error("Error fetching consultation detail:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
