import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User Logout
 *     description: Clears the authentication token from cookies.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Set expiration to past date to delete it
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
