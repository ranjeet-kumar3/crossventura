import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, country, subject, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, Email, and Message are required" },
        { status: 400 }
      );
    }

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    // Send email to support
    await sendContactEmail({ name, email, phone, country, message });

    return NextResponse.json(
      { message: "Your message has been sent successfully!", contact },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CONTACT_API_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
