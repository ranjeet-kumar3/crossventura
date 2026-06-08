import { NextResponse } from 'next/server';
import { comparePassword } from '@/lib/hash';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/mail';

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User Login (Step 1 - Credentials)
 *     description: Verifies credentials and sends a 6-digit OTP to the user's email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       401:
 *         description: Invalid credentials
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 0. Normalize inputs
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      console.log(`Login failed: User not found for email: ${normalizedEmail}`);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 2. Check password
    if (!user.password) {
      console.log(`Login failed: User ${normalizedEmail} has no password (likely signed up via Google)`);
      return NextResponse.json(
        { message: 'This account uses Google login. Please sign in with Google.' },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      console.log(`Login failed: Invalid password for user: ${normalizedEmail}`);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 2.5 Check if verified
    if (!user.isVerified) {
      return NextResponse.json(
        { 
          message: 'Your email is not verified. Please verify your email before logging in.',
          requireVerification: true 
        },
        { status: 403 }
      );
    }

    // 3. Generate final JWT
    const { generateToken } = await import('@/lib/token');
    const token = generateToken({ 
      userId: user.id, 
      email: user.email 
    });

    // 4. Success response with cookie
    const { password: _, ...userWithoutPassword } = user;
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
        token
      },
      { status: 200 }
    );

    // Set cookie
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
