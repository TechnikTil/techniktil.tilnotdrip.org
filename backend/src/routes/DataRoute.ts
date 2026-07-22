import Route from "@/Route";
import * as dateFns from "date-fns-tz";
import { Application, Request, Response } from "express";
import fs from "fs/promises";
import yaml from "js-yaml";
import { marked } from "marked";

export default class DataRoute implements Route
{
  init(app: Application): void
  {
    app.get("/data/timezone", (_req: Request, res: Response) =>
    {
      const tzName: string = process.env.TIMEZONE ?? "UTC";
      const date: Date = new Date();

      const timezoneName: string = dateFns.formatInTimeZone(date, tzName, "zzzz");
      const timezoneOffset: number = dateFns.getTimezoneOffset(tzName, date) / -60000;

      res.status(200).json({name: timezoneName, offset: timezoneOffset, timestamp: date.toISOString()});
    });

    app.get("/data/greetings", async (_req: Request, res: Response) =>
    {
      const greetingText: string = await fs.readFile("assets/greetings.txt", "utf8");

      const greetingList: string[] = greetingText.trim().split("\n").map((v) => v.trim());
      res.status(200).json(greetingList);
    });

    app.get("/data/socials", async (_req: Request, res: Response) =>
    {
      const socialsText: string = await fs.readFile("assets/socials.yaml", "utf8");

      const socialsData: {socials?: SocialPlatform[];} = yaml.load(socialsText) ?? {};
      res.status(200).json(socialsData.socials ?? []);
    });

    app.get("/data/projects", async (_req: Request, res: Response) =>
    {
      const projectListText: string = await fs.readFile("assets/projects/list.txt", "utf8");
      const projectList: string[] = projectListText.trim().split("\n").map((v) => v.trim());

      async function createProjectData(id: string): Promise<ProjectsData>
      {
        const content: string = await fs.readFile(`assets/projects/${id}.md`, "utf8");
        const splitContent: string[] = content.split("---");

        const fm: ProjectsDataNoHTML = yaml.load(splitContent[1]) as ProjectsDataNoHTML;
        const html: string = await marked(splitContent[2]);
        return {...fm, html};
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
