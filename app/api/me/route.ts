import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/get-user-id';

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get Current User Profile
 *     description: Returns the profile of the currently logged-in user based on the JWT token in cookies.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile found
 *       401:
 *         description: Not authenticated
 */
export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        onboardingDetails: {
          select: {
            businessName: true
          }
        },
        onboardingBusinessDetails: {
          select: {
            businessName: true
          }
        },
        onboardingManageBusiness: {
          select: {
            businessName: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get the most relevant business name from any of the onboarding models
    const businessName = 
      user.onboardingBusinessDetails?.businessName || 
      user.onboardingManageBusiness?.businessName || 
      user.onboardingDetails?.businessName || 
      "";

    // Return a flattened user object for easier consumption
    const enrichedUser = {
      ...user,
      businessName
    };

    return NextResponse.json({ user: enrichedUser }, { status: 200 });

  } catch (error: any) {
    console.error('Me API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/me:
 *   patch:
 *     summary: Update Current User Profile
 *     description: Updates the profile information of the currently logged-in user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authenticated
 */
export async function PATCH(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { name, email, phone, businessName } = await request.json();

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { message: 'Email is already in use' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
        onboardingDetails: {
          upsert: {
            create: {
              businessName,
              email: email
            },
            update: {
              businessName
            }
          }
        },
        // Synchronize with BusinessDetails model if it exists or create it
        onboardingBusinessDetails: {
          upsert: {
            create: {
              businessName
            },
            update: {
              businessName
            }
          }
        },
        // Synchronize with ManageBusiness model if it exists or create it
        onboardingManageBusiness: {
          upsert: {
            create: {
              businessName
            },
            update: {
              businessName
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        onboardingDetails: { select: { businessName: true } },
        onboardingBusinessDetails: { select: { businessName: true } },
        onboardingManageBusiness: { select: { businessName: true } }
      }
    });

    const enrichedUser = {
      ...updatedUser,
      businessName: 
        updatedUser.onboardingBusinessDetails?.businessName || 
        updatedUser.onboardingManageBusiness?.businessName || 
        updatedUser.onboardingDetails?.businessName || 
        ""
    };

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Profile Update API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
