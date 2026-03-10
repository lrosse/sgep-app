import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // Isso vai mostrar no terminal toda vez que o banco for acessado
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
