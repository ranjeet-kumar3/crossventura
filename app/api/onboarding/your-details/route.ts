import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";

/**
 * @swagger
 * /api/onboarding/your-details:
 *   post:
 *     summary: Save Onboarding Your Details
 *     description: Upserts the onboarding details (name, email, phone, business type) for the currently authenticated user.
 *     tags: [Onboarding]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               businessType:
 *                 type: string
 *               businessName:
 *                 type: string
 *               website:
 *                 type: string
 *     responses:
 *       200:
 *         description: Onboarding data saved successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
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
        const { fullName, email, phoneNumber, country, timezone, businessType, businessName, website } = data;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const onboarding = await prisma.onboardingYourDetails.upsert({
            where: { userId: user.id },
            update: {
                fullName,
                email,
                phoneNumber,
                country,
                timezone,
                businessType,
                businessName,
                website,
            },
            create: {
                userId: user.id,
                fullName,
                email,
                phoneNumber,
                country,
                timezone,
                businessType,
                businessName,
                website,
            },
        });

        return NextResponse.json(onboarding);
    } catch (error) {
        console.error("Onboarding Your Details Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
