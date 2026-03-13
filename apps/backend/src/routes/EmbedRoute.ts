import Route from "@/Route";
import ejs from "ejs";
import { Application, Request, Response } from "express";

const WEBSITE_TITLE: string = "TechnikTil's Website";
const DEFAULT_DESCRIPTION: string = "a website i will probably never update";

export default class EmbedRoute extends Route
{
	public static init(app: Application): void
	{
		app.get("/render-embed{/*path}", async (req: Request, res: Response) =>
		{
			const path: string = String(req.params.path);

			let title: string = WEBSITE_TITLE;
			let description: string = DEFAULT_DESCRIPTION;

			switch (path)
			{
				case "aboutMe":
					title = `${title} - About Me!`;
					description =
						"Go check out some things about me! Especially my timezone, so you don't message me at 2 AM.";
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

			const page: string = await ejs.renderFile("embed.ejs", {title: title, description: description});

			res.set("Content-Type", "text/html");
			res.send(page);
		});
	}
}
