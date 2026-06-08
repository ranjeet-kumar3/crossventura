import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyToken } from "@/lib/token";

export async function getUserId() {
  // 1. Check manual JWT token in cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded && decoded.userId) {
      return decoded.userId;
    }
  }

  // 2. Check NextAuth session
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return (session.user as any).id;
  }

  return null;
}
