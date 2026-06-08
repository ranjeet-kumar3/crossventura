import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1. Check if admin token is present
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Get params
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || null;
    const serviceType = searchParams.get("serviceType") || null;
    const state = searchParams.get("state") || null;
    const timezone = searchParams.get("timezone") || null;

    const skip = (page - 1) * limit;

    // 3. Build Filter Conditions
    const whereCondition: any = {
      AND: []
    };

    if (search) {
      whereCondition.AND.push({
        user: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ]
        }
      });
    }

    if (status) {
      whereCondition.AND.push({ status: status });
    }

    if (timezone) {
      whereCondition.AND.push({ timezone: timezone });
    }

    // Filters for derived fields (State, ServiceType) are harder with direct prisma findMany
    // We'll filter them in memory if they are provided, or better, query them if possible.
    // For now, let's fetch and then format.

    // 4. Fetch Consultations
    const consultations = await prisma.onboardingConsultation.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          include: {
            onboardingDetails: true,
            onboardingPlan: true,
            onboardingBusinessDetails: true,
            onboardingCategory: true,
            onboardingKyc: true,
            payments: true,
          }
        }
      }
    });

    const totalCount = await prisma.onboardingConsultation.count({
      where: whereCondition,
    });

    // 5. Format Data
    const formattedData = consultations.map((item, index) => {
      const user = item.user;
      
      // Derive Service Type
      let derivedServiceType = "Consultation";
      if (user.onboardingPlan?.plan) {
        derivedServiceType = `${user.onboardingPlan.plan.toUpperCase()} Formation`;
      } else if (user.onboardingCategory?.category === "manage your exisitng business") {
        derivedServiceType = "Business Management";
      }

      // Derive State
      const derivedState = user.onboardingBusinessDetails?.stateOfFormation || user.onboardingPlan?.state || "N/A";

      return {
        id: item.id,
        displayId: (skip + index + 1).toString().padStart(2, "0"),
        userName: user.name || "N/A",
        email: user.email,
        phone: user.phone || "N/A",
        serviceType: derivedServiceType,
        date: item.date || "N/A",
        time: item.time || "N/A",
        timezone: item.timezone || "N/A",
        state: derivedState,
        status: item.status,
        
        // Additional info for detail view/modal
        details: {
          country: user.onboardingDetails?.country || "N/A",
          businessName: user.onboardingBusinessDetails?.businessName || "N/A",
          category: user.onboardingCategory?.category || "N/A",
          plan: user.onboardingPlan?.plan || "N/A",
          totalPaid: user.payments.reduce((sum, p) => sum + p.amount, 0) / 100, // Assuming amount is in cents
          documents: user.onboardingKyc ? [
            { name: "Passport", status: user.onboardingKyc.passportUrl ? "Uploaded" : "Pending" },
            { name: "PAN Card", status: user.onboardingKyc.panCardUrl ? "Uploaded" : "Pending" },
            { name: "Aadhaar Card", status: user.onboardingKyc.aadhaarCardUrl ? "Uploaded" : "Pending" },
          ] : []
        }
      };
    });

    // Final in-memory filter for derived fields if needed
    let finalData = formattedData;
    if (serviceType) {
      finalData = finalData.filter(d => d.serviceType === serviceType);
    }
    if (state) {
      finalData = finalData.filter(d => d.state === state);
    }

    return NextResponse.json({
      consultations: finalData,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });

  } catch (error: any) {
    console.error("Error in GET consultations:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, date, time, timezone } = body;

    if (!id) {
      return NextResponse.json({ error: "Consultation ID is required" }, { status: 400 });
    }

    const updated = await prisma.onboardingConsultation.update({
      where: { id: id },
      data: {
        ...(status && { status }),
        ...(date && { date }),
        ...(time && { time }),
        ...(timezone && { timezone }),
      },
      include: {
        user: true
      }
    });

    // Send email notification if rescheduled
    if (status === 'Rescheduled' || (date && updated.status === 'Rescheduled')) {
      const { sendRescheduleEmail } = await import("@/lib/mail");
      await sendRescheduleEmail(
        updated.user.email,
        updated.user.name || "User",
        updated.date || date,
        updated.time || time,
        updated.timezone || timezone || "UTC"
      );
    }

    return NextResponse.json({ message: "Consultation updated successfully", data: updated });

  } catch (error: any) {
    console.error("Error in PATCH consultation:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
