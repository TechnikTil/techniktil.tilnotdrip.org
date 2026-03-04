import { type JSX } from "react";
import Page from "./Page";

export default class AboutMePage extends Page
{
	static navName: string = "About Me";
	static url: string = "/aboutMe";

	render(): JSX.Element
	{
		return (
			<div>
				<h1>Hello World! This is About Me.</h1>
			</div>
		);
	}
}
