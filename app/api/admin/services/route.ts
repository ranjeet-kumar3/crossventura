import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_SERVICES = [
  // Start Flow Add-ons
  { name: "EIN Letter", type: "One-time", price: "$80", category: "Add-ons", availability: "All States", businessFlow: "Start your new business", planType: "All Plans", status: "Active" },
  { name: "Virtual Mailbox", type: "Monthly", price: "$25", category: "Add-ons", availability: "All States", businessFlow: "Start your new business", planType: "All Plans", status: "Active" },
  { name: "Virtual Bank Account Setup", type: "One-time", price: "$100", category: "Add-ons", availability: "Online", businessFlow: "Start your new business", planType: "All Plans", status: "Active" },
  { name: "BOIR Filing (if required)", type: "One-time", price: "$200", category: "Add-ons", availability: "All States", businessFlow: "Start your new business", planType: "All Plans", status: "Active" },
  { name: "Operating Agreement for LLC", type: "One-time", price: "$150", category: "Add-ons", availability: "All States", businessFlow: "Start your new business", planType: "All Plans", status: "Active" },
  { name: "Bookkeeping & Accounting", type: "Monthly", price: "$200", category: "Add-ons", availability: "All States", businessFlow: "Start your new business", planType: "All Plans", status: "Active" },
  { name: "Physical office address for verifications", type: "Monthly", price: "$200", category: "Add-ons", availability: "USA", businessFlow: "Start your new business", planType: "All Plans", status: "Active" },

  // Manage Flow - Scaling
  { name: "Google Verification", type: "One-time", price: "$299", category: "Post Business Setup & Scaling", availability: "New York, California, Texas", businessFlow: "Manage your existing business", planType: "N/A", status: "Active" },
  { name: "Board Flex", type: "One-time", price: "$500", category: "Post Business Setup & Scaling", availability: "New York, California, Texas", businessFlow: "Manage your existing business", planType: "N/A", status: "Active" },
  { name: "Physical Office Address", type: "Monthly", price: "$200", category: "Post Business Setup & Scaling", availability: "USA", businessFlow: "Manage your existing business", planType: "N/A", status: "Active" },
  { name: "Virtual Office Address", type: "Monthly", price: "$35", category: "Post Business Setup & Scaling", availability: "Online", businessFlow: "Manage your existing business", planType: "N/A", status: "Active" },
  { name: "Warehousing & Logistics", type: "One-time", price: "$49", category: "Post Business Setup & Scaling", availability: "Online", businessFlow: "Manage your existing business", planType: "N/A", status: "Active" },

  // Manage Flow - Payments
  { name: "Physical Bank Account", type: "Consultation", price: "$49", category: "Payments Solutions", availability: "Texas", businessFlow: "Manage your existing business", planType: "N/A", status: "Active" },
  { name: "Payment Gateway & Merchant Solutions", type: "Consultation", price: "$49", category: "Payments Solutions", availability: "Texas", businessFlow: "Manage your existing business", planType: "N/A", status: "Active" },

  // Manage Flow - Compliances
  { name: "Annual Taxation Guidance", type: "Consultation", price: "$49", category: "Compliances", availability: "All States", businessFlow: "Manage your existing business", planType: "N/A", status: "Active" },
];

// GET handler to fetch all services
export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const flow = searchParams.get("flow") || "";
    const plan = searchParams.get("plan") || "";

    let services = await (prisma as any).service.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
            ],
          } : {},
          flow ? { businessFlow: flow } : {},
          plan ? { planType: plan } : {},
        ]
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Auto-align Google Verification & Board Flex availability with frontend defaults
    let needsRefetch = false;
    for (const service of services) {
      if ((service.name === "Google Verification" || service.name === "Board Flex") && service.availability === "All States") {
        await (prisma as any).service.update({
          where: { id: service.id },
          data: { availability: "New York, California, Texas" }
        });
        needsRefetch = true;
      }
    }
    if (needsRefetch) {
      services = await (prisma as any).service.findMany({
        where: {
          AND: [
            search ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
              ],
            } : {},
            flow ? { businessFlow: flow } : {},
            plan ? { planType: plan } : {},
          ]
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // Auto-align legacy category names with new category names in existing records
    let needsCatRefetch = false;
    for (const service of services) {
      let updatedCat = null;
      if (service.category === "Scaling" || service.category === "Scaling Services") {
        updatedCat = "Post Business Setup & Scaling";
      } else if (service.category === "Payments" || service.category === "Payment Solutions") {
        updatedCat = "Payments Solutions";
      }
      
      if (updatedCat) {
        await (prisma as any).service.update({
          where: { id: service.id },
          data: { category: updatedCat }
        });
        needsCatRefetch = true;
      }
    }
    if (needsCatRefetch) {
      services = await (prisma as any).service.findMany({
        where: {
          AND: [
            search ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
              ],
            } : {},
            flow ? { businessFlow: flow } : {},
            plan ? { planType: plan } : {},
          ]
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // Auto-fix for missing businessFlow/planType in existing records
    const missingData = services.filter((s: any) => !s.businessFlow || !s.planType);
    if (missingData.length > 0) {
      for (const service of missingData) {
        let flow = "Start your new business";
        let plan = "All Plans";
        let cat = service.category || "Add-ons";

        // Logic to determine flow based on category or name
        const manageKeywords = [" Scaling", "Payments", "Compliances", "Google", "Board", "Office", "Warehousing", "Taxation"];
        if (manageKeywords.some(k => (service.name + service.category).includes(k))) {
          flow = "Manage your existing business";
          plan = "N/A";
        }
 
        await (prisma as any).service.update({
          where: { id: service.id },
          data: { businessFlow: flow, planType: plan, category: cat }
        });
      }
      // Re-fetch after fix
      services = await (prisma as any).service.findMany({
        where: {
          AND: [
            search ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
              ],
            } : {},
            flow ? { businessFlow: flow } : {},
            plan ? { planType: plan } : {},
          ]
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // Seed if empty
    if (services.length === 0 && !search && !flow && !plan) {

      // Clear existing if any to avoid duplicates with old schema
      await (prisma as any).service.deleteMany({});

      await (prisma as any).service.createMany({
        data: DEFAULT_SERVICES,
      });
      services = await (prisma as any).service.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

// POST handler to create or update a service
export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = await request.json();
    const { id, name, type, price, availability, businessFlow, planType, category, status, description } = data;

    if (id) {
      // Update existing service
      const updatedService = await (prisma as any).service.update({
        where: { id },
        data: { name, type, price, availability, businessFlow, planType, category, status, description },
      });
      return NextResponse.json(updatedService);
    } else {
      // Create new service
      const newService = await (prisma as any).service.create({
        data: { name, type, price, availability, businessFlow, planType, category, status, description },
      });
      return NextResponse.json(newService, { status: 201 });
    }
  } catch (error) {

    console.error("Error saving service:", error);
    return NextResponse.json({ error: "Failed to save service" }, { status: 500 });
  }
}

// DELETE handler to remove a service
export async function DELETE(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    await (prisma as any).service.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
