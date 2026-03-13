import Route from "@/Route";
import * as dateFns from "date-fns-tz";
import { Application, Request, Response } from "express";

export default class TimezoneRoute extends Route
{
	public static init(app: Application): void
	{
		app.get("/timezone", async (_req: Request, res: Response) =>
		{
			const tzName: string = Bun.env.TIMEZONE || "UTC";
			const date: Date = new Date();

			const timezoneName: string = dateFns.formatInTimeZone(date, tzName, "zzzz");
			const timezoneOffset: number = dateFns.getTimezoneOffset(tzName, date) / -60000;

			res.json({name: timezoneName, offset: timezoneOffset, timestamp: date.toISOString()});
		});
	}
}
