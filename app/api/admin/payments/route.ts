import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    // Basic admin authentication check
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Search condition for user's name or email, or payment intent ID
    const whereCondition: any = {};
    if (search) {
      whereCondition.OR = [
        { stripePaymentIntentId: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Fetch paginated data
    const [payments, totalItems] = await Promise.all([
      prisma.payment.findMany({
        where: whereCondition,
        include: {
          user: {
            select: { name: true, email: true, phone: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where: whereCondition }),
    ]);

    // Calculate overall stats across all payments
    const allPaymentsForStats = await prisma.payment.findMany({
      select: { amount: true, status: true }
    });
    console.log("DB Payments for Stats:", allPaymentsForStats);

    let totalRevenueCents = 0;
    let successfulCount = 0;
    let failedCount = 0;

    allPaymentsForStats.forEach((p) => {
      const statusLower = p.status.toLowerCase();
      if (statusLower === 'succeeded' || statusLower === 'paid' || statusLower === 'success') {
        totalRevenueCents += p.amount;
        successfulCount++;
      } else if (statusLower === 'failed' || statusLower === 'canceled') {
        failedCount++;
      }
    });

    const totalPages = Math.ceil(totalItems / limit);

    // Format for frontend
    const formattedPayments = payments.map((p) => {
      const statusLower = p.status.toLowerCase();
      let frontendStatus = 'Pending';
      if (statusLower === 'succeeded' || statusLower === 'paid' || statusLower === 'success') {
        frontendStatus = 'Paid';
      } else if (statusLower === 'failed' || statusLower === 'canceled') {
        frontendStatus = 'Failed';
      }

      return {
        id: p.id,
        userName: p.user?.name || p.user?.email || "Unknown User",
        email: p.user?.email || "N/A",
        phone: p.user?.phone || "N/A",
        stripePaymentIntentId: p.stripePaymentIntentId,
        billingAddress: p.billingAddress || "N/A",
        city: p.city || "N/A",
        zipCode: p.zipCode || "N/A",
        currency: p.currency.toUpperCase(),
        amount: `$${(p.amount / 100).toFixed(2)}`,
        type: p.planType || "Service",
        status: frontendStatus,
        date: p.createdAt.toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
      };
    });

    return NextResponse.json({
      payments: formattedPayments,
      stats: {
        totalRevenue: `$${(totalRevenueCents / 100).toFixed(2)}`,
        successfulCount,
        failedCount
      },
      totalPages,
      totalItems,
    });

  } catch (error) {
    console.error('Error fetching admin payments:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
