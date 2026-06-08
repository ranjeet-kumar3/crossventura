import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";

export async function POST(req: Request) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        const data = await req.json();
        const {
            category,
            categories,
            selectedServices,
            serviceStates,
            totalAmount
        } = data;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const onboardingCategory = await prisma.onboardingCategory.upsert({
            where: { userId: user.id },
            update: {
                category,
                categories,
                selectedServices,
                serviceStates,
                totalAmount
            },
            create: {
                userId: user.id,
                category,
                categories,
                selectedServices,
                serviceStates,
                totalAmount
            },
        });

        return NextResponse.json(onboardingCategory);
    } catch (error) {
        console.error("Onboarding Category Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
