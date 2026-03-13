import Route from "@/Route";
import bcrypt from "bcryptjs";
import { Cipheriv, CipherKey, createCipheriv, createDecipheriv, Decipheriv, randomBytes, scryptSync } from "crypto";
import { Application, NextFunction, Request, Response } from "express";
import prisma from "prisma/db";
import { AdminAccount } from "prisma/generated/client";
import { promisify } from "util";

declare module "express-session"
{
	interface SessionData
	{
		adminUsername: string;
		adminCipher: string;
	}
}

export default class AdminRoute extends Route
{
	static init(app: Application): void
	{
		app.get("/admin/salt/:username", async (req: Request, res: Response) =>
		{
			const username: string = req.params.username as string;

			const account: AdminAccount | null = await prisma.adminAccount.findUnique({where: {username}});
			if (!account)
			{
				res.sendStatus(404);
				return;
			}

			res.status(200).send(account.passwordSalt);
		});

		app.post("/admin/login", async (req: Request, res: Response) =>
		{
			req.session.adminUsername = undefined;
			req.session.adminCipher = undefined;

			const body: LoginBody | undefined = req.body as LoginBody | undefined;
			if (!body)
			{
				console.log(req.body, body);
				res.sendStatus(400);
				return;
			}

			const account: AdminAccount | null = await prisma.adminAccount.findUnique({
				where: {username: body.username},
			});

			if (!account)
			{
				res.sendStatus(404);
				return;
			}

			if (account.passwordHash !== body.hash)
			{
				res.sendStatus(401);
				return;
			}

			req.session.adminUsername = account.username;
			req.session.adminCipher = createCipher(account);
			res.sendStatus(200);
		});

		app.delete("/admin/login", async (req: Request, res: Response) =>
		{
			req.session.adminUsername = undefined;
			req.session.adminCipher = undefined;
			res.sendStatus(200);
		});

		app.get("/admin/check", async (req: Request, res: Response) =>
		{
			await isAdmin(req, res, () => res.sendStatus(200));
		});
	}
}

type LoginBody = {username: string; hash: string;};

export async function isAdmin(req: Request, res: Response, next: NextFunction)
{
	if (!req.session.adminUsername || !req.session.adminCipher)
	{
		res.status(401).send("Not Logged In");
		return;
	}

	const admin: AdminAccount | null = await prisma.adminAccount.findUnique({
		where: {username: req.session.adminUsername},
	});

	if (!admin || !checkCipher(req.session.adminCipher, admin))
	{
		res.status(401).send("Outdated Account");
		return;
	}

	next();
}

function createCipher(account: AdminAccount): string
{
	const IV: Buffer = Buffer.from(randomBytes(16));

	const encrypter: Cipheriv = createCipheriv("aes-256-cbc", getKey(account), IV);
	encrypter.end(account.username + account.passwordHash + account.passwordSalt);

	return Buffer.concat([IV, encrypter.read()]).toString("base64url");
}

function checkCipher(cipher: string, account: AdminAccount): boolean
{
	const buffer: Buffer = Buffer.from(cipher, "base64url");

	const IV: Buffer = buffer.subarray(0, 16);
	const cipherText: Buffer = buffer.subarray(16);

	const decrypter: Decipheriv = createDecipheriv("aes-256-cbc", getKey(account), IV);
	decrypter.end(cipherText);

	const value: string = (decrypter.read() as Buffer | null)?.toString("utf8") ?? "";
	const valueCheck: string = account.username + account.passwordHash + account.passwordSalt;

	return value === valueCheck;
}

function getKey(account: AdminAccount): CipherKey
{
	return scryptSync(account.passwordHash, account.passwordSalt, 32);
}
