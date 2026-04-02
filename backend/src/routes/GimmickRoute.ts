import Route from "@/Route";
import prisma, { StrawGimmick } from "database";
import { Application, Request, Response } from "express";
import { isAdmin } from "./AdminRoute";

export default class GimmickRoute implements Route
{
	init(app: Application): void
	{
		app.post("/gimmick/text", async (req: Request, res: Response) =>
		{
			const body: GimmickTextBody | undefined = req.body as GimmickTextBody | undefined;

			const text: string = body?.text ?? "";
			const date: Date = new Date(body?.timestamp ?? Date.now());

			try
			{
				await prisma.strawGimmick.create({data: {text: text, date: date}});
				console.log(
					`Wrote new gimmick (Text, ${date.toISOString()}, ${String(await prisma.strawGimmick.count())})`,
				);

				res.sendStatus(200);
			}
			catch (e)
			{
				console.error(e);
				res.sendStatus(400);
			}
		});

		app.post("/gimmick/image", async (req: Request, res: Response) =>
		{
			const body: GimmickImageBody | undefined = req.body as GimmickImageBody | undefined;
			const svg: string = body?.svg ?? "";
			const date: Date = new Date(body?.timestamp ?? Date.now());

			try
			{
				await prisma.strawGimmick.create({data: {svg, date}});
				console.log(
					`Wrote new gimmick (Image, ${date.toISOString()}, ${String(await prisma.strawGimmick.count())})`,
				);

				res.sendStatus(200);
			}
			catch (e)
			{
				console.error(e);
				res.sendStatus(400);
			}
		});

		app.get("/gimmick/list", isAdmin, async (_req: Request, res: Response) =>
		{
			const gimmicks: StrawGimmick[] = await prisma.strawGimmick.findMany({orderBy: [{date: "desc"}]});
			res.status(200).json(gimmicks);
		});

		app.delete("/gimmick/delete/:id", isAdmin, async (req: Request, res: Response) =>
		{
			const id: string = req.params.id as string;

			try
			{
				await prisma.strawGimmick.delete({where: {id: id}});
				res.sendStatus(200);
			}
			catch (e)
			{
				console.error(e);
				res.sendStatus(400);
			}
		});
	}
}

interface GimmickTextBody
{
	text: string;
	timestamp: string;
}

interface GimmickImageBody
{
	svg: string;
	timestamp: string;
}
