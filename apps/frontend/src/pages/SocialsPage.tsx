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
				<div style={{marginTop: 45, fontSize: 30}}>My Socials!</div>
				<div style={{marginTop: 2, fontSize: 22}}>
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
					return <div key={value.name}>{value.platform}: {link}</div>;
				})}
			</div>
		);
	}
}
