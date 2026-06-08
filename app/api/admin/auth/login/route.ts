import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/hash';
import { sign } from 'jsonwebtoken'; // Assuming they might want JWT or we use cookies

const JWT_SECRET = process.env.JWT_SECRET || 'admin_secret_key_123';

/**
 * @swagger
 * /api/admin/auth/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticates an admin user and sets an admin_token cookie.
 *     tags: [Admin Auth]
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
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials or authentication method not supported
 *       403:
 *         description: Access denied. You do not have admin privileges.
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 1. Basic Validation
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Find User in Database
        // Note: We are assuming there's a 'role' field or a specific admin email for now
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 3. Verify Password
        if (!user.password) {
            return NextResponse.json(
                { message: 'Authentication method not supported for this account' },
                { status: 401 }
            );
        }

        const isPasswordCorrect = await comparePassword(password, user.password);
        
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 4. Role Check
        if (user.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Access denied. You do not have admin privileges.' },
                { status: 403 }
            );
        }

        // 5. Generate a simple token or set a cookie
        // Note: For a robust system, integrating with next-auth credentials provider is better
        const token = sign(
            { userId: user.id, email: user.email, role: 'ADMIN' },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Success response
        const response = NextResponse.json(
            { 
                message: 'Login successful',
                user: { id: user.id, email: user.email, name: user.name }
            },
            { status: 200 }
        );

        // Set an auth cookie (Optional but recommended for session management)
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Admin Login API Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
