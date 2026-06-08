// Triggering reload after schema change
import { PrismaClient } from "@/src/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  const pool = new Pool({ 
    connectionString,
    max: 4,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({ 
    adapter,
    log: ["query", "error", "warn"]
  });
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;