import cors from "cors";
import { randomBytes } from "crypto";
import express, { Application, Request, Response } from "express";
import session from "express-session";
import { promisify } from "util";
import ROUTES from "./routes";

const app: Application = express();
const PORT: number = 5000;
const SECRET: string | undefined = Bun.env.SESSION_SECRET;

async function main(): Promise<void>
{
	app.use(cors());
	app.use(express.json());
	app.disable("etag");

	app.use(
		session({
			secret: SECRET || await promisify(randomBytes)(32),
			resave: true,
			saveUninitialized: true,
			cookie: {maxAge: 253402300000000},
		}),
	);

	for (const Route of ROUTES) Route.init(app);

	app.get("/ping", (_req: Request, res: Response) =>
	{
		res.json({message: "Pong!", timestamp: new Date().toISOString()});
	});

	app.listen(PORT, () =>
	{
		console.log(`Backend ready on port ${PORT}`);
	});
}

void main();
