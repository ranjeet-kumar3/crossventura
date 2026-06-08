import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();
    
    if (!normalizedEmail) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // 2.5 Debug: Log available models if property is missing
    const prismaAny = prisma as any;
    if (!prismaAny.passwordResetToken && !prismaAny.PasswordResetToken) {
      console.log('Available Prisma models:', Object.keys(prismaAny).filter(k => !k.startsWith('_')));
      const modelName = Object.keys(prismaAny).find(k => k.toLowerCase() === 'passwordresettoken');
      if (modelName) {
        console.log(`Found model with name: ${modelName}`);
      } else {
         return NextResponse.json({ message: 'Database configuration error: Reset model not found' }, { status: 500 });
      }
    }

    // 2. Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 3. Save to PasswordResetToken table
    const resetModel = prismaAny.passwordResetToken || prismaAny.PasswordResetToken;
    
    await resetModel.upsert({
      where: { email: normalizedEmail },
      update: {
        token: otpCode,
        expiresAt,
      },
      create: {
        email: normalizedEmail,
        token: otpCode,
        expiresAt,
      },
    });

    // 4. Send Email
    const mailOptions = {
      from: `"CrossVentura" <${process.env.SMTP_USER}>`,
      to: normalizedEmail,
      subject: 'Password Reset Code - CrossVentura',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Use the following code to proceed:</p>
          <h1 style="color: #F59E0B; letter-spacing: 5px;">${otpCode}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    // Note: I'm using a custom mail sender logic here or could reuse sendOtpEmail if I generalize it
    // For now let's just use a simple transporter here or update mail.ts
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Reset code sent to your email.' }, { status: 200 });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
