import { type JSX } from "react";
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
				<h1>Hello World! This is Socials.</h1>
			</div>
		);
	}
}
