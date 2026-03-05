import cors from "cors";
import express, { Application, Request, Response } from "express";
import "dotenv/config";

const app: Application = express();
const PORT: number = 5000;

app.use(cors());
app.use(express.json());

// TODO: move these into seperate modules later.

app.get("/ping", (req: Request, res: Response) =>
{
	res.json({message: "Pong!", timestamp: new Date().toISOString()});
});

app.get("/timezone", (req: Request, res: Response) =>
{
	const date: Date = new Date();

	const timezoneName: string =
		new Intl.DateTimeFormat("en-CA", {timeZoneName: "long"}).formatToParts(new Date()).find(part =>
			part.type === "timeZoneName"
		)?.value || "Unknown???? :whattheshit:";

	res.json({name: timezoneName, offset: date.getTimezoneOffset(), timestamp: date.toISOString()});
});

app.listen(PORT, () =>
{
	console.log(`Backend ready on port ${PORT}`);
});
