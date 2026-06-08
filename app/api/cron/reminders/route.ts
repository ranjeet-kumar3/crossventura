import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingReminderEmail } from "@/lib/mail";
import { addMinutes, subMinutes, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export async function GET(req: Request) {
  try {
    const now = new Date();
    
    // --- 1. 30 MINUTE REMINDERS ---
    const thirtyMinutesFromNow = addMinutes(now, 30);
    const window30Start = subMinutes(thirtyMinutesFromNow, 5);
    const window30End = addMinutes(thirtyMinutesFromNow, 5);

    const pending30m = await prisma.onboardingConsultation.findMany({
      where: {
        status: "booked",
        reminder30Sent: false,
        scheduledAt: { gte: window30Start, lte: window30End }
      },
      include: { user: { select: { email: true, name: true } } }
    });

    for (const booking of pending30m) {
      const zonedDate = toZonedTime(booking.scheduledAt!, booking.timezone || 'UTC');
      const formattedDate = format(zonedDate, "PPPP");
      const formattedTime = format(zonedDate, "hh:mm aa");

      const success = await sendBookingReminderEmail(
        booking.user.email,
        booking.user.name || "Customer",
        formattedDate,
        formattedTime,
        booking.timezone || "UTC"
      );

      if (success) {
        await prisma.onboardingConsultation.update({
          where: { id: booking.id },
          data: { reminder30Sent: true }
        });
      }
    }

    // --- 2. 10 MINUTE REMINDERS ---
    const tenMinutesFromNow = addMinutes(now, 10);
    const window10Start = subMinutes(tenMinutesFromNow, 5);
    const window10End = addMinutes(tenMinutesFromNow, 5);

    const { sendFinalBookingReminderEmail } = await import("@/lib/mail");
    const pending10m = await prisma.onboardingConsultation.findMany({
      where: {
        status: "booked",
        reminder10Sent: false,
        scheduledAt: { gte: window10Start, lte: window10End }
      },
      include: { user: { select: { email: true, name: true } } }
    });

    for (const booking of pending10m) {
      const zonedDate = toZonedTime(booking.scheduledAt!, booking.timezone || 'UTC');
      const formattedDate = format(zonedDate, "PPPP");
      const formattedTime = format(zonedDate, "hh:mm aa");

      const success = await sendFinalBookingReminderEmail(
        booking.user.email,
        booking.user.name || "Customer",
        formattedDate,
        formattedTime,
        booking.timezone || "UTC"
      );

      if (success) {
        await prisma.onboardingConsultation.update({
          where: { id: booking.id },
          data: { reminder10Sent: true }
        });
      }
    }

    // --- 3. AUTO-CANCEL OVERDUE (30+ Minutes Past) ---
    const thirtyMinutesAgo = subMinutes(now, 30);
    const overdueBookings = await prisma.onboardingConsultation.findMany({
      where: {
        status: "booked",
        scheduledAt: { lt: thirtyMinutesAgo }
      }
    });

    for (const booking of overdueBookings) {
      await prisma.onboardingConsultation.update({
        where: { id: booking.id },
        data: { status: "Cancelled" }
      });
      console.log(`Auto-cancelled overdue booking: ${booking.id}`);
    }

    return NextResponse.json({ 
      reminders30m: pending30m.length,
      reminders10m: pending10m.length,
      autoCancelled: overdueBookings.length
    });
  } catch (error) {
    console.error("Reminder/Cancel Cron Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
