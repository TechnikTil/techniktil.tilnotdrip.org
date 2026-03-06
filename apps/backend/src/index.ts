import cors from "cors";
import * as dateFns from "date-fns-tz";
import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT: number = Number(Bun.env.BACKEND_PORT) || 5000;

app.use(cors());
app.use(express.json());

// TODO: move these into seperate modules later.

app.get("/ping", (_req: Request, res: Response) =>
{
	res.json({message: "Pong!", timestamp: new Date().toISOString()});
});

app.get("/timezone", (_req: Request, res: Response) =>
{
	const tzName: string = Bun.env.TIMEZONE || "UTC";
	const date: Date = new Date();

	const timezoneName: string = dateFns.formatInTimeZone(date, tzName, "zzzz");
	const timezoneOffset: number = dateFns.getTimezoneOffset(tzName, date) / -60000;

	res.json({name: timezoneName, offset: timezoneOffset, timestamp: date.toISOString()});
});

app.listen(PORT, () =>
{
	console.log(`Backend ready on port ${PORT}`);
});
