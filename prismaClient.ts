import { PrismaClient } from "./server/db/generated/postgresDB";

export const prisma: PrismaClient = new PrismaClient({
  log: ["query", "error", "warn", "info"],
});
