import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";

export async function GET() {
    return NextResponse.json({
        name: "Global Plan",
        price: 49,
        timeline: "~7 business days",
        features: [
            "Warehousing in NY, Texas, California, Delaware, Wyoming, Florida",
            "Order processing & fulfilment"
        ],
        supportedStates: ["New York", "Texas", "California"]
    });
}

export async function POST(req: Request) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const data = await req.json();

        const globalDetails = await prisma.onboardingGlobalPlan.upsert({
            where: { userId: userId },
            update: {
                exportingToUS: data.exportingToUS,
                productCategory: data.productCategory,
                quantity: data.quantity,
                dimensions: data.dimensions,
                frequency: data.frequency,
                approxOrders: data.approxOrders,
                shipmentWeight: data.shipmentWeight,
                logisticsPartner: data.logisticsPartner,
                logisticsPartnerName: data.logisticsPartnerName,
                returnHandling: data.returnHandling,
                timeline: data.timeline,
                boxLength: data.boxLength,
                boxWidth: data.boxWidth,
                boxHeight: data.boxHeight,
                avgWeight: data.avgWeight,
                numProductsPerBox: data.numProductsPerBox,
            },
            create: {
                userId: userId,
                exportingToUS: data.exportingToUS,
                productCategory: data.productCategory,
                quantity: data.quantity,
                dimensions: data.dimensions,
                frequency: data.frequency,
                approxOrders: data.approxOrders,
                shipmentWeight: data.shipmentWeight,
                logisticsPartner: data.logisticsPartner,
                logisticsPartnerName: data.logisticsPartnerName,
                returnHandling: data.returnHandling,
                timeline: data.timeline,
                boxLength: data.boxLength,
                boxWidth: data.boxWidth,
                boxHeight: data.boxHeight,
                avgWeight: data.avgWeight,
                numProductsPerBox: data.numProductsPerBox,
            },
        });

        return NextResponse.json(globalDetails);
    } catch (error) {
        console.error("Global Plan POST Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
