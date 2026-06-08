import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";

/**
 * @swagger
 * /api/onboarding/select-plan:
 *   post:
 *     summary: Save Onboarding Selected Plan
 *     description: Updates the user's onboarding record with the selected plan and consultation booking status.
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
 *               plan:
 *                 type: string
 *                 enum: [starter, premium, global]
 *               bookConsultation:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Plan selection saved successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User or Onboarding record not found
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
        const { plan, state, bookConsultation } = data;

        const onboarding = await prisma.onboardingSelectPlan.upsert({
            where: { userId: userId },
            update: {
                plan,
                state,
                bookConsultation,
            },
            create: {
                userId: userId,
                plan,
                state,
                bookConsultation,
            },
        });

        return NextResponse.json(onboarding);
    } catch (error) {
        console.error("Onboarding Select Plan Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
