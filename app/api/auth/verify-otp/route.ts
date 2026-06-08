import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/token';

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify 2FA OTP
 *     description: Verifies the 6-digit code sent via email and returns a JWT session token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification successful
 *       400:
 *         description: Invalid or expired code
 */
export async function POST(request: Request) {
  try {
    const { email: rawEmail, code: rawCode } = await request.json();
    const email = rawEmail?.trim().toLowerCase();
    const code = rawCode?.trim();

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email and code are required' },
        { status: 400 }
      );
    }

    console.log(`Verifying OTP for: ${email}, Code: ${code}`);

    // 1. Find the latest OTP for this email
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        code,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      }
    });

    if (!otpRecord) {
      console.log(`No OTP record found for email: ${email} and code: ${code}`);
      return NextResponse.json(
        { message: 'Invalid OTP code' },
        { status: 400 }
      );
    }

    // Check expiration
    if (otpRecord.expiresAt < new Date()) {
      console.log(`OTP expired for: ${email}. Expired at: ${otpRecord.expiresAt}`);
      return NextResponse.json(
        { message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // 2. Generate final JWT
    const token = generateToken({ 
      userId: otpRecord.userId, 
      email: otpRecord.email 
    });

    // 3. Mark user as verified and Delete the used OTP
    await prisma.user.update({
      where: { id: otpRecord.userId },
      data: { isVerified: true }
    });

    await prisma.otp.deleteMany({
      where: { email }
    });

    // 4. Success response
    const { password: _, ...userWithoutPassword } = otpRecord.user;

    const response = NextResponse.json(
      {
        message: 'Verification successful',
        user: userWithoutPassword,
        token
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
