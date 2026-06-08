import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/hash';

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !code || !newPassword) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Verify OTP
    const prismaAny = prisma as any;
    const resetModel = prismaAny.passwordResetToken || prismaAny.PasswordResetToken;

    const resetRecord = await resetModel.findFirst({
      where: {
        email: normalizedEmail,
        token: code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetRecord) {
      return NextResponse.json({ message: 'Invalid or expired reset code' }, { status: 400 });
    }

    // 2. Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // 3. Update user password
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { password: hashedPassword },
    });

    // 4. Delete reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetRecord.id },
    });

    return NextResponse.json({ message: 'Password reset successful. You can now login.' }, { status: 200 });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
