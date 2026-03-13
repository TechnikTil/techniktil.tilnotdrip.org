import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/client";

const adapter: PrismaLibSql = new PrismaLibSql({url: process.env.DATABASE_URL || "file:./dev.db"});
const prisma: PrismaClient = new PrismaClient({adapter});
export default prisma;
