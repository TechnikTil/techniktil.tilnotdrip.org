import { type JSX } from "react";
import ApiCache from "../ApiCache";
import Page from "./Page";

export default class SocialsPage extends Page
{
	static navName: string = "Socials";
	static url: string = "/socials";
	static pageTitle: string = "Socials!";

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
		return (
			<div className="socials">
				{ApiCache.socialsData.map((value: any) =>
				{
					const link: JSX.Element = <a href={value.url}>{value.name}</a>;
					return <div key={value.platform}>{value.platform}: {link}</div>;
				})}
			</div>
		);
	}
}
