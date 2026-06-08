import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";

// Triggering module reload after prisma regenerate

/**
 * @swagger
 * /api/onboarding/business-details:
 *   post:
 *     summary: Save Onboarding Business Details
 *     description: Upserts the business formation details for the currently authenticated user.
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
 *               entityType:
 *                 type: string
 *               businessName:
 *                 type: string
 *               businessAddress:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               country:
 *                 type: string
 *               numMembers:
 *                 type: integer
 *               numShareholders:
 *                 type: integer
 *               regAgentType:
 *                 type: string
 *               regAgentName:
 *                 type: string
 *               regAgentAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Business details saved successfully
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
        const {
            entityType,
            stateOfFormation,
            businessName,
            businessAddress,
            city,
            state,
            zipCode,
            country,
            numMembers,
            numShareholders,
            regAgentType,
            regAgentName,
            regAgentAddress,
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

        const onboarding = await prisma.onboardingBusinessDetails.upsert({
            where: { userId: user.id },
            update: {
                entityType,
                stateOfFormation,
                businessName,
                businessAddress,
                city,
                state,
                zipCode,
                country,
                numMembers: numMembers ? parseInt(numMembers) : undefined,
                numShareholders: numShareholders ? parseInt(numShareholders) : undefined,
                regAgentType,
                regAgentName,
                regAgentAddress,
            },
            create: {
                userId: user.id,
                entityType,
                stateOfFormation,
                businessName,
                businessAddress,
                city,
                state,
                zipCode,
                country,
                numMembers: numMembers ? parseInt(numMembers) : undefined,
                numShareholders: numShareholders ? parseInt(numShareholders) : undefined,
                regAgentType,
                regAgentName,
                regAgentAddress,
            },
        });

        return NextResponse.json(onboarding);
    } catch (error) {
        console.error("Onboarding Business Details Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
