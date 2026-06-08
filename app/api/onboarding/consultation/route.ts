import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";
import { sendBookingConfirmationEmail, sendAdminBookingNotification } from "@/lib/mail";
import { fromZonedTime } from "date-fns-tz";
import { format } from "date-fns";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { date, time, timezone } = await req.json();

    // Get user email and name for the email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, phone: true }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Parse date: "10 / 05 / 2026" -> [10, 5, 2026]
    const [day, month, year] = date.split(" / ").map(Number);
    
    // Parse time: "09:30 AM" -> [9, 30]
    const [timeStr, modifier] = time.split(" ");
    let [hours, minutes] = timeStr.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    // Create a date string and convert to UTC using the provided timezone
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    const scheduledAt = fromZonedTime(dateStr, timezone || 'UTC');

    const consultation = await prisma.onboardingConsultation.upsert({
      where: { userId: userId },
      update: { 
        date, 
        time, 
        timezone, 
        scheduledAt, 
        status: "booked" 
      },
      create: { 
        userId: userId, 
        date, 
        time, 
        timezone, 
        scheduledAt, 
        status: "booked" 
      },
    });

    // Send confirmation email with nicely formatted date
    await sendBookingConfirmationEmail(
      user.email,
      user.name || "Valued Customer",
      format(new Date(year, month - 1, day), "PPPP"), // e.g. Sunday, May 10th, 2026
      time,
      timezone || 'UTC'
    );

    // Send notification to Admin
    await sendAdminBookingNotification(
      'contact@crossventura.com',
      { 
        name: user.name || "Valued Customer", 
        email: user.email, 
        phone: user.phone || undefined 
      }, 
      format(new Date(year, month - 1, day), "PPPP"),
      time,
      timezone || 'UTC'
    );

    return NextResponse.json(consultation);
  } catch (error) {
    console.error("Consultation Save Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
