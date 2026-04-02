import Route from "@/Route";
import { markdown, YAML } from "bun";
import * as dateFns from "date-fns-tz";
import { Application, Request, Response } from "express";

export default class DataRoute implements Route
{
	init(app: Application): void
	{
		app.get("/data/timezone", (_req: Request, res: Response) =>
		{
			const tzName: string = Bun.env.TIMEZONE ?? "UTC";
			const date: Date = new Date();

			const timezoneName: string = dateFns.formatInTimeZone(date, tzName, "zzzz");
			const timezoneOffset: number = dateFns.getTimezoneOffset(tzName, date) / -60000;

			res.status(200).json({name: timezoneName, offset: timezoneOffset, timestamp: date.toISOString()});
		});

		app.get("/data/greetings", async (_req: Request, res: Response) =>
		{
			const greetingFile: Bun.BunFile = Bun.file("assets/greetings.txt");
			const greetingText: string = await greetingFile.text();

			const greetingList: string[] = greetingText.trim().split("\n").map(v => v.trim());
			res.status(200).json(greetingList);
		});

		app.get("/data/socials", async (_req: Request, res: Response) =>
		{
			const socialsFile: Bun.BunFile = Bun.file("assets/socials.yaml");
			const socialsText: string = await socialsFile.text();

			const socialsData: {socials?: SocialPlatform[];} = YAML.parse(socialsText) ?? {};
			res.status(200).json(socialsData.socials ?? []);
		});

		app.get("/data/projects", async (_req: Request, res: Response) =>
		{
			const projectListFile: Bun.BunFile = Bun.file("assets/projects/list.txt");
			const projectListText: string = await projectListFile.text();
			const projectList: string[] = projectListText.trim().split("\n").map(v => v.trim());

			async function createProjectData(id: string): Promise<ProjectsData>
			{
				const file: Bun.BunFile = Bun.file(`assets/projects/${id}.md`);
				const content: string = await file.text();

				const splitContent: string[] = content.split("---");
				const fm: ProjectsDataNoHTML = YAML.parse(splitContent[1]) as ProjectsDataNoHTML;
				return {...fm, html: markdown.html(splitContent[2]).trim()};
			}

			const projects: ProjectsData[] = await Promise.all(projectList.map(createProjectData));

			res.status(200).json(projects);
		});
	}
}

interface SocialPlatform
{
	platform: string;
	name: string;
	url: string;
}

interface ProjectsData
{
	name: string;
	image: string;
	downloads: ProjectDownload[];
	html: string;
}

interface ProjectsDataNoHTML
{
	name: string;
	image: string;
	downloads: ProjectDownload[];
}

interface ProjectDownload
{
	name: string;
	url: string;
}
