import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    let linkedInProfile: string | undefined;
    const fileUrls: Record<string, string> = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      linkedInProfile = body.linkedInProfile;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      linkedInProfile = formData.get("linkedInProfile") as string;

      const fileFields = [
        "passport", "panCard", "drivingLicense", "addressProof", "aadhaarCard", "utilityBill", "einLetter"
      ];

      const uploadDir = path.join(process.cwd(), "public", "uploads", "kyc");
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) { }

      for (const field of fileFields) {
        const file = formData.get(field) as File | null;
        if (file && file.size > 0 && typeof file !== 'string') {
          const buffer = Buffer.from(await file.arrayBuffer());
          const filename = `${userId}-${field}-${Date.now()}${path.extname(file.name)}`;
          const filepath = path.join(uploadDir, filename);
          await writeFile(filepath, buffer);
          fileUrls[`${field}Url`] = `/uploads/kyc/${filename}`;
          fileUrls[`${field}Status`] = 'pending';
        }
      }
    }

    const kyc = await prisma.onboardingKyc.upsert({
      where: { userId: userId },
      update: {
        ...fileUrls,
        linkedInProfile,
        status: 'pending', // Reset status to pending so admin gets notified to review again
      },
      create: {
        userId: userId,
        ...fileUrls,
        linkedInProfile,
        status: 'pending',
      },
    });

    return NextResponse.json(kyc, { status: 200 });
  } catch (error: any) {
    console.error("KYC Error Details:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const kyc = await prisma.onboardingKyc.findUnique({
      where: { userId: userId },
    });

    // Also fetch the user's country from onboarding details to determine required documents
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        onboardingDetails: { select: { country: true } },
        onboardingManageBusiness: { select: { country: true } },
      },
    });

    const country = user?.onboardingDetails?.country || user?.onboardingManageBusiness?.country || "";

    if (!kyc) {
      return NextResponse.json({ message: "No KYC data found", country }, { status: 200 });
    }

    return NextResponse.json({ ...kyc, country }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
