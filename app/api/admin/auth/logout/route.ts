import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/admin/auth/logout:
 *   post:
 *     summary: Admin Logout
 *     description: Logs out the authenticated admin user by clearing the admin_token cookie.
 *     tags: [Admin Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function POST() {
    const response = NextResponse.json(
        { message: 'Logged out successfully' },
        { status: 200 }
    );

    // Clear the admin_token cookie on the server side
    response.cookies.set('admin_token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return response;
}
