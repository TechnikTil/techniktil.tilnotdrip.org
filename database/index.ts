import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

const adapter: PrismaPg = new PrismaPg({connectionString: Bun.env.DATABASE_URL});
const prisma: PrismaClient = new PrismaClient({adapter});

export default prisma;
export * from "./generated/client";
