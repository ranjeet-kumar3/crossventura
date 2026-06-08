import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";

export async function GET() {
    return NextResponse.json({
        name: "Premium Plan",
        price: 849,
        badge: "Recommended",
        features: [
            "Name availability check for C-corp",
            "C-Corp formation",
            "Bylaws & certificates",
            "Articles of incorporation",
            "Registered agent (1 year included)",
            "EIN included",
            "State filing (up to 7 business days)"
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

        const premiumDetails = await prisma.onboardingPremiumPlan.upsert({
            where: { userId: userId },
            update: { addOnServices },
            create: { userId: userId, addOnServices },
        });

        return NextResponse.json(premiumDetails);
    } catch (error) {
        console.error("Premium Plan POST Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
