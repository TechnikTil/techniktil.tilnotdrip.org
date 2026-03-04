import cors from "cors";
import express, { Application, Request, Response } from "express";
import "dotenv/config";

const app: Application = express();
const PORT: number = 5000;

app.use(cors());
app.use(express.json());

app.get("/ping", (req: Request, res: Response) =>
{
	res.json({message: "Pong!", timestamp: new Date().toISOString()});
});

app.listen(PORT, () =>
{
	console.log(`Backend ready on port ${PORT}`);
});
