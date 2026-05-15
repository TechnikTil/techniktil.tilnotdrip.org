import cookieParser from "cookie-parser";
import cors from "cors";
import { randomBytes } from "crypto";
import express, { Application, Request, Response } from "express";
import { promisify } from "util";
import ROUTES from "./routes";

const app: Application = express();
const PORT = 5000;
export let SECRET: string | undefined = Bun.env.COOKIE_SECRET;

async function main(): Promise<void>
{
  if (!SECRET)
  {
    const generatedSecret: Buffer = await promisify(randomBytes)(32);
    SECRET = generatedSecret.toBase64();
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
