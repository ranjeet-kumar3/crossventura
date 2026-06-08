import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";

export async function GET() {
    return NextResponse.json({
        name: "Starter Plan",
        price: 249,
        timeline: "~7 business days",
        features: [
            "Name availability check (LLC)",
            "Articles of organization",
            "Basic operating agreement",
            "State filing",
            "Email support"
        ]
    });
}

export async function POST(req: Request) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const { addOnServices } = await req.json();

        const starterDetails = await prisma.onboardingStarterPlan.upsert({
            where: { userId: userId },
            update: { addOnServices },
            create: { userId: userId, addOnServices },
        });

        return NextResponse.json(starterDetails);
    } catch (error) {
        console.error("Starter Plan POST Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
