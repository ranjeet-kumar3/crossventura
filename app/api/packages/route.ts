import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: {
        status: "Active",
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error fetching public packages:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}
