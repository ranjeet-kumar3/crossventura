import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/get-user-id';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const formData = await request.json();
    const { image } = formData;

    if (!image) {
      return NextResponse.json(
        { message: 'No image data provided' },
        { status: 400 }
      );
    }

    if (image.startsWith('data:image')) {
      const base64Data = image.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      const fileName = `profile-${userId}-${Date.now()}.jpg`;
      const publicPath = join(process.cwd(), 'public', 'uploads');

      // Ensure directory exists
      await mkdir(publicPath, { recursive: true });

      const filePath = join(publicPath, fileName);
      await writeFile(filePath, buffer);

      const imageUrl = `/uploads/${fileName}`;

      // Update user in DB
      await prisma.user.update({
        where: { id: userId },
        data: { image: imageUrl },
      });

      return NextResponse.json({
        message: 'Image uploaded successfully',
        imageUrl
      }, { status: 200 });
    }

    return NextResponse.json(
      { message: 'Invalid image format' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Profile image upload error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get current image path from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    // Delete file from disk if it's a local upload
    if (user?.image && user.image.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', user.image);
      try {
        await unlink(filePath);
      } catch {
        // File may not exist — continue anyway
      }
    }

    // Set image to null in DB
    await prisma.user.update({
      where: { id: userId },
      data: { image: null },
    });

    return NextResponse.json(
      { message: 'Profile photo removed successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Profile image delete error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
