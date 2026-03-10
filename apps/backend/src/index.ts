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

app.get("/render-embed{/*path}", (req: Request, res: Response) =>
{
	const path: string = String(req.params.path);

	let title: string = "TechnikTil's Website";
	let description: string = "a website i will probably never update";

	switch (path)
	{
		case "aboutMe":
			title = `${title} - About Me!`;
			description = "Go check out some things about me! Especially my timezone, so you don't message me at 2 AM.";
			break;
		case "projects":
			title = `${title} - Projects!`;
			description =
				"Go check out the projects I have worked on / contributed to! It's basically my resume at this point.";
			break;
		case "socials":
			title = `${title} - Socials!`;
			description = "Most of my active social medias are listed here. Go check it out!";
			break;
	}

	res.set("Content-Type", "text/html");
	res.status(200).send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="og:title" content="${title}" />
                <meta property="og:description" content="${description}" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary">
                <meta name="theme-color" content="#FFFF00">
                <title>${title}</title>
            </head>
            <body>
                <h1>${title}</h1>
                <p>${description}</p>
            </body>
        </html>
    `);
	console.log(`Served embed for "${path}"`);
});

app.post("/straw/text", (req: Request, res: Response) =>
{
	console.log(req.body);
});

app.post("/straw/image", (req: Request, res: Response) =>
{
	console.log(req.body);
});

app.listen(PORT, () =>
{
	console.log(`Backend ready on port ${PORT}`);
});
