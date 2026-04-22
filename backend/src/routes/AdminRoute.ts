import Route from "@/Route";
import bcrypt from "bcryptjs";
import prisma, { AdminAccount } from "database";
import { Application, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "..";

export default class AdminRoute implements Route
{
	init(app: Application): void
	{
		app.post("/admin/login", async (req: Request, res: Response) =>
		{
			res.clearCookie("adminToken");

			const body: AccountRequest | undefined = req.body as AccountRequest | undefined;
			if (!body)
			{
				res.sendStatus(400);
				return;
			}

			const account: AdminAccount | null = await prisma.adminAccount.findUnique({
				where: {username: body.username},
			});
			const hashMatches: boolean = await bcrypt.compare(body.password, account?.passwordHash ?? "");

			if (!account || !hashMatches)
			{
				res.status(401).send("Username or Password invalid");
				return;
			}

			const token: string = jwt.sign({userID: account.id, username: account.username}, SECRET ?? "", {
				expiresIn: "2W",
			});

			res.cookie("adminToken", token, {httpOnly: true, secure: true, sameSite: "strict"});
			res.sendStatus(200);
		});

		app.post("/admin/register", isAdmin, async (req: Request, res: Response) =>
		{
			const body: AccountRequest | undefined = req.body as AccountRequest | undefined;
			if (!body)
			{
				res.sendStatus(400);
				return;
			}

			const hash: string = await bcrypt.hash(body.password, 12);
			await prisma.adminAccount.create({data: {username: body.username, passwordHash: hash}});
			console.log(`Registered ${body.username}!`);

			res.sendStatus(200);
		});

		app.delete("/admin/login", (_req: Request, res: Response) =>
		{
			// I'll take this as a log out.
			res.clearCookie("adminToken");
			res.sendStatus(200);
		});

		app.get("/admin/check", (req: Request, res: Response) =>
		{
			isAdmin(req, res, () => res.sendStatus(200));
		});
	}
}

interface AccountRequest
{
	username: string;
	password: string;
}
interface AdminPayload
{
	userID: string;
	username: string;
}
export type AdminRequest = Request & {user?: AdminPayload;};

export function isAdmin(req: AdminRequest, res: Response, next: NextFunction)
{
	const token: string | undefined = req.cookies.adminToken as string | undefined;

	if (!token)
	{
		res.status(401).send("Not Logged In");
		return;
	}

	try
	{
		const decoded = jwt.verify(token, SECRET ?? "") as AdminPayload;
		req.user = decoded;
	}
	catch (err: unknown)
	{
		res.clearCookie("adminToken");
		res.status(401).send("Invalid or expired session");
		console.error(err);
		return;
	}

	next();
}
