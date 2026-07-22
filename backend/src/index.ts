import "./loadenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import prisma from "database";
import express, { Application, Request, Response } from "express";
import ROUTES from "./routes";

const app: Application = express();
const PORT = 5000;
export const SECRET: string | undefined = process.env.COOKIE_SECRET;

async function main(): Promise<void>
{
  await prisma.$queryRaw`SELECT 1`;

  if (!SECRET)
  {
    console.error("No secret found.");
    process.exit(1);
  }

  app.use(cors());
  app.use(express.json());
  app.disable("etag");
  app.use(cookieParser());

  for (const Route of ROUTES)
  {
    Route.init(app);
  }

  app.get("/ping", (_req: Request, res: Response) =>
  {
    res.json({message: "Pong!", timestamp: new Date().toISOString()});
  });

  app.listen(PORT, () =>
  {
    console.log(`Backend ready on port ${String(PORT)}`);
  });
}

void main();
