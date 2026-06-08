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
            fullName,
            email,
            phoneNumber,
            country,
            timezone,
            hasRegisteredCompany,
            businessName,
            countryOfRegistration,
            state,
            businessCategory,
            otherBusinessCategory,
            lookingFor,
            otherLookingFor,
            businessDescription
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

        const onboarding = await prisma.onboardingManageBusiness.upsert({
            where: { userId: user.id },
            update: {
                fullName,
                email,
                phoneNumber,
                country,
                timezone,
                hasRegisteredCompany,
                businessName,
                countryOfRegistration,
                state,
                businessCategory,
                otherBusinessCategory,
                lookingFor,
                otherLookingFor,
                businessDescription
            },
            create: {
                userId: user.id,
                fullName,
                email,
                phoneNumber,
                country,
                timezone,
                hasRegisteredCompany,
                businessName,
                countryOfRegistration,
                state,
                businessCategory,
                otherBusinessCategory,
                lookingFor,
                otherLookingFor,
                businessDescription
            },
        });

        return NextResponse.json(onboarding);
    } catch (error) {
        console.error("Onboarding Manage Business Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
