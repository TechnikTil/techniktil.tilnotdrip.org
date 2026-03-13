import prisma from "@/../prisma/db";
import Route from "@/Route";
import { ArrayXY, Polyline, registerWindow, SVG, Svg } from "@svgdotjs/svg.js";
import { Application, Request, Response } from "express";
import { StrawGimmick } from "prisma/generated/client";
import { createSVGWindow, SVGDocument, SVGWindow } from "svgdom";
import { isAdmin } from "./AdminRoute";

const window: SVGWindow = createSVGWindow();
const document: SVGDocument = window.document;
registerWindow(window, document);

export default class StrawRoute extends Route
{
	public static init(app: Application): void
	{
		app.post("/straw/text", async (req: Request, res: Response) =>
		{
			const text: string = req.body?.text ?? "";
			const date: Date = new Date(req.body?.timestamp ?? Date.now());

			try
			{
				await prisma.strawGimmick.create({data: {text: text, date: date}});
				console.log(`Wrote new gimmick (Text, ${date.toISOString()}, ${await prisma.strawGimmick.count()})`);

				res.sendStatus(200);
			}
			catch (e)
			{
				console.error(e);
				res.sendStatus(400);
			}
		});

		app.post("/straw/image", async (req: Request, res: Response) =>
		{
			const save: CanvasSave = req.body?.save ?? {} as CanvasSave;
			const date: Date = new Date(req.body?.timestamp ?? Date.now());

			try
			{
				await prisma.strawGimmick.create({data: {svg: convertSave(save), date: date}});
				console.log(`Wrote new gimmick (Image, ${date.toISOString()}, ${await prisma.strawGimmick.count()})`);

				res.sendStatus(200);
			}
			catch (e)
			{
				console.error(e);
				res.sendStatus(400);
			}
		});

		app.get("/straw/list", isAdmin, async (_req: Request, res: Response) =>
		{
			const gimmicks: StrawGimmick[] = await prisma.strawGimmick.findMany({orderBy: [{date: "asc"}]});
			res.status(200).json(gimmicks);
		});

		app.delete("/straw/delete/:id", isAdmin, async (req: Request, res: Response) =>
		{
			const id: string = req.params.id as string;

			try
			{
				await prisma.strawGimmick.delete({where: {id: Number(id)}});
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

function convertSave(save: CanvasSave): string
{
	const canvas: Svg = SVG(document.documentElement) as Svg;
	canvas.size(save.width, save.height);
	canvas.namespace();

	canvas.clear();
	canvas.rect("100%", "100%").fill("#fff");

	for (const line of save.lines)
	{
		const points: ArrayXY[] = line.points.map(value => [value.x, value.y]);
		const svgLine: Polyline = canvas.polyline(points);
		svgLine.fill("none");
		svgLine.stroke({color: line.brushColor, width: line.brushRadius * 2, linecap: "round", linejoin: "round"});
	}

	return canvas.svg();
}

type CanvasSave = {width: number; height: number; lines: CanvasLine[];};
type CanvasLine = {points: CanvasPoint[]; brushColor: string; brushRadius: number;};
type CanvasPoint = {x: number; y: number;};
