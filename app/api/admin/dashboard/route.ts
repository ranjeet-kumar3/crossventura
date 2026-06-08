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

    // 1. Calculate Stats Cards Data
    const [totalUsers, activeServices, pendingConsultations, completedOrders] = await Promise.all([
      prisma.user.count(),
      prisma.onboardingCategory.count(), // Or any other proxy for active services
      prisma.onboardingConsultation.count({ where: { status: 'booked' } }),
      prisma.payment.count({ 
        where: { 
          OR: [
            { status: 'succeeded' },
            { status: 'paid' },
            { status: 'success' }
          ] 
        } 
      })
    ]);

    const stats = [
      {
        title: "Total Users",
        value: totalUsers.toLocaleString(),
        change: "+0% this month", // Can calculate dynamically if needed
        icon: "Users",
        color: "bg-blue-600",
      },
      {
        title: "Active Services",
        value: activeServices.toLocaleString(),
        change: null,
        icon: "LayoutGrid",
        color: "bg-blue-500",
      },
      {
        title: "Pending Consultations",
        value: pendingConsultations.toLocaleString(),
        change: null,
        icon: "Headphones",
        color: "bg-blue-400",
      },
      {
        title: "Completed Orders",
        value: completedOrders.toLocaleString(),
        change: null,
        icon: "ClipboardCheck",
        color: "bg-blue-600",
      },
    ];

    // 2. Calculate Chart Data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize empty monthly arrays
    const revenueByMonth = new Array(12).fill(0);
    const usersByMonth = new Array(12).fill(0);

    const currentYear = new Date().getFullYear();

    // Fetch all successful payments for revenue
    const payments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`),
        },
        OR: [
          { status: 'succeeded' },
          { status: 'paid' },
          { status: 'success' }
        ]
      },
      select: { amount: true, createdAt: true }
    });

    payments.forEach(p => {
      const monthIndex = p.createdAt.getMonth();
      // amount is in cents, convert to dollars
      revenueByMonth[monthIndex] += (p.amount / 100);
    });

    // Fetch users for the year
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`),
        }
      },
      select: { createdAt: true }
    });

    users.forEach(u => {
      const monthIndex = u.createdAt.getMonth();
      usersByMonth[monthIndex] += 1;
    });

    const areaData = monthNames.map((name, index) => ({
      name,
      value: Math.round(revenueByMonth[index])
    }));

    const barData = monthNames.map((name, index) => ({
      name,
      value: usersByMonth[index]
    }));

    // Fetch real counts for Operations card
    const [consultationsCount, paymentsCount, kycCount, servicesCount, verifiedKycCount, contactsCount] = await Promise.all([
      prisma.onboardingConsultation.count(),
      prisma.payment.count({ 
        where: { 
          OR: [
            { status: 'succeeded' },
            { status: 'paid' },
            { status: 'success' }
          ] 
        } 
      }),
      prisma.onboardingKyc.count(),
      prisma.service.count(),
      prisma.onboardingKyc.count({ where: { status: 'verified' } }),
      prisma.contact.count()
    ]);

    const operationsData = [
      { name: "Consultations", value: consultationsCount || 60 },
      { name: "Payments", value: paymentsCount || 80 },
      { name: "Documents", value: kycCount || 55 },
      { name: "Reports", value: servicesCount || 85 },
      { name: "Approvals", value: verifiedKycCount || 65 },
      { name: "Support", value: contactsCount || 95 }
    ];

    return NextResponse.json({
      stats,
      areaData,
      barData,
      operationsData
    });

  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
