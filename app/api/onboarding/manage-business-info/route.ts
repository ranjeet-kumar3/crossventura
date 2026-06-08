import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    try {
        const userId = await getUserId();

        if (!userId) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        const data = await req.json();
        const {
            businessType,
            description,
            documentUrls
        } = data;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const savedDocumentUrls: string[] = [];

        if (documentUrls && Array.isArray(documentUrls)) {
            const uploadDir = path.join(process.cwd(), "public", "uploads", "business");
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (err) {}

            for (let i = 0; i < documentUrls.length; i++) {
                const doc = documentUrls[i];
                if (typeof doc === 'object' && doc && doc.content && doc.content.startsWith('data:')) {
                    try {
                        const base64Data = doc.content.split(';base64,').pop();
                        const buffer = Buffer.from(base64Data, 'base64');
                        const ext = doc.name.split('.').pop() || 'pdf';
                        const filename = `${userId}-biz-${i}-${Date.now()}.${ext}`;
                        const filepath = path.join(uploadDir, filename);
                        await writeFile(filepath, buffer);
                        savedDocumentUrls.push(`/uploads/business/${filename}`);
                    } catch (e) {
                        console.error("Failed to save base64 file:", e);
                        savedDocumentUrls.push(doc.name);
                    }
                } else {
                    savedDocumentUrls.push(typeof doc === 'string' ? doc : (doc?.name || "Business Document"));
                }
            }
        }

        const onboarding = await prisma.onboardingManageBusinessInfo.upsert({
            where: { userId: user.id },
            update: {
                businessType,
                description,
                documentUrls: savedDocumentUrls
            },
            create: {
                userId: user.id,
                businessType,
                description,
                documentUrls: savedDocumentUrls
            },
        });

        return NextResponse.json(onboarding);
    } catch (error) {
        console.error("Onboarding Manage Business Info Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
