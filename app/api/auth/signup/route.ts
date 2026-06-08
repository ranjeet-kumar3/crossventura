import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/hash';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User Signup
 *     description: Registers a new user in the system.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists
 */
export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = body;

    // 0. Normalize email
    const normalizedEmail = email?.trim().toLowerCase();

    // 1. Validation
    if (!normalizedEmail || !password || !name) {
      return NextResponse.json(
        { message: 'Missing required fields: name, email, and password are required' },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // 2.1 Check if phone already exists
    if (phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone: phone },
      });

      if (existingPhone) {
        return NextResponse.json(
          { message: 'This phone number is already registered with another account' },
          { status: 409 }
        );
      }
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Create user (unverified)
    console.log('Attempting to create user...');
    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        isVerified: false,
      },
    });
    console.log('User created successfully:', newUser.id);

    // 5. Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 6. Save OTP to DB
    console.log('Attempting to save OTP...');
    await prisma.otp.create({
      data: {
        code: otpCode,
        email: normalizedEmail,
        userId: newUser.id,
        expiresAt,
      }
    });
    console.log('OTP saved successfully');

    // 7. Send OTP via Email
    console.log('Attempting to send OTP email to:', newUser.email);
    const { sendOtpEmail } = await import('@/lib/mail');
    const emailSent = await sendOtpEmail(normalizedEmail, otpCode);

    if (!emailSent) {
       console.error('Email sending failed');
       return NextResponse.json(
        { message: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('Signup process completed successfully');
    return NextResponse.json(
      {
        message: 'Signup successful. Please verify your email.',
        requireOtp: true,
        email: normalizedEmail
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Signup error details:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
