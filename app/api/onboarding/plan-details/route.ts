import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";

export async function GET() {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const planDetails = await prisma.onboardingSelectPlan.findUnique({
            where: { userId: userId }
        });

        if (!planDetails) {
            return NextResponse.json({ message: "No plan details found" }, { status: 404 });
        }

        return NextResponse.json(planDetails);
    } catch (error) {
        console.error("GET Plan Details Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const { plan, state, bookConsultation } = await req.json();

        const onboarding = await prisma.onboardingSelectPlan.upsert({
            where: { userId: userId },
            update: { plan, state, bookConsultation },
            create: { userId: userId, plan, state, bookConsultation },
        });

        return NextResponse.json(onboarding);
    } catch (error) {
        console.error("POST Plan Details Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
