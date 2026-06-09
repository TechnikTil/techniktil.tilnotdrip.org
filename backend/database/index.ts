import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/client";

const pool: Pool = new Pool({connectionString: process.env.DATABASE_URL});
const adapter: PrismaPg = new PrismaPg(pool);

const prisma: PrismaClient = new PrismaClient({adapter});
export default prisma;
export * from "./generated/client";
