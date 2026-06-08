import { NextResponse } from "next/server";
import { getUserId } from "@/lib/get-user-id";
import { sendReceiptEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const { email, customerName, pdfBase64, orderId, recurringDetails } = await req.json();

        if (!email || !pdfBase64 || !orderId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const success = await sendReceiptEmail(email, customerName, pdfBase64, orderId, recurringDetails);

        if (success) {
            return NextResponse.json({ message: "Receipt email sent successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Failed to send receipt email" }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Send Receipt API Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
