import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET handler to fetch all packages
export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    const packages = await (prisma as any).package.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { state: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Fetch unique plans from existing users to pre-populate the list
    const userPlans = await prisma.onboardingSelectPlan.findMany({
      select: {
        plan: true,
        state: true,
      },
      distinct: ['plan', 'state']
    });

    // Map user plans to the package format
    const stateFeeMap: Record<string, string> = {
      "delaware": "$160",
      "wyoming": "$103",
      "florida": "$125",
      "texas": "$310",
      "nevada": "$425",
      "new york": "$205",
      "california": "$90",
      "new mexico": "$50",
      "washington": "$200"
    };

    const legacyPackages = userPlans
      .filter(up => {
        if (!up.plan) return false;
        const upPlanNormalized = up.plan.toLowerCase().trim();
        return !packages.find((p: any) => {
          const pNameNormalized = p.name.toLowerCase().trim();
          return pNameNormalized.includes(upPlanNormalized);
        });
      })
      .map((up, idx) => ({
        id: `legacy-${idx}`,
        name: up.plan === 'starter' ? 'Starter Plan' : up.plan === 'premium' ? 'Premium Plan' : up.plan === 'global' ? 'Global Plan' : up.plan,
        price: up.plan === 'starter' ? '$249' : up.plan === 'premium' ? '$849' : '$49',
        state: up.state,
        stateFee: up.state ? (stateFeeMap[up.state.toLowerCase()] || 'N/A') : 'N/A',
        category: 'Start your new business',
        status: 'Active',
        supportedStates: ["Delaware", "Wyoming", "Florida", "Texas", "Nevada", "New York", "California", "New Mexico", "Washington"],
        isLegacy: true // Flag to identify these are from user data
      }));

    return NextResponse.json([...packages, ...legacyPackages]);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

// POST handler to create or update a package
export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = await request.json();
    const { id, name, price, state, stateFee, supportedStates, category, status } = data;

    if (id && !id.startsWith('legacy-')) {
      // Update existing package
      const updatedPackage = await (prisma as any).package.update({
        where: { id },
        data: { name, price, state, stateFee, supportedStates, category, status },
      });
      return NextResponse.json(updatedPackage);
    } else {
      // Create new package (or convert legacy)
      const newPackage = await (prisma as any).package.create({
        data: { name, price, state, stateFee, supportedStates, category, status },
      });
      return NextResponse.json(newPackage, { status: 201 });
    }
  } catch (error) {
    console.error("Error saving package:", error);
    return NextResponse.json({ error: "Failed to save package" }, { status: 500 });
  }
}

// DELETE handler to remove a package
export async function DELETE(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
    }

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
