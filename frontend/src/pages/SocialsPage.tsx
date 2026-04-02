import { type JSX } from "react";
import ApiCache from "../ApiCache";
import Page from "./Page";

export default class SocialsPage extends Page
{
	static navName = "Socials";
	static url = "/socials";
	static pageTitle = "Socials!";

	render(): JSX.Element
	{
		return (
			<div>
				<div className="pageHookTitle">My Socials!</div>
				<div className="socialsHookDesc">
					99% of the time, the user will be <span className="yellow">TechnikTil</span>
					. Here are some important links though:
				</div>
				<this.List />
			</div>
		);
	}

	List(): JSX.Element
	{
		const socialsData: SocialPlatform[] = ApiCache.get("/api/data/socials") as SocialPlatform[];

		return (
			<div className="socials">
				{socialsData.map((value: SocialPlatform) =>
				{
					const link: JSX.Element = <a href={value.url}>{value.name}</a>;
					return <div key={value.platform}>{value.platform}: {link}</div>;
				})}
			</div>
		);
	}
}

interface SocialPlatform
{
	platform: string;
	name: string;
	url: string;
}
