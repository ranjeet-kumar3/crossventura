import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch unread notifications
    const notifications = await prisma.notification.findMany({
      where: { isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    if (id) {
      // Mark single notification as read
      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
