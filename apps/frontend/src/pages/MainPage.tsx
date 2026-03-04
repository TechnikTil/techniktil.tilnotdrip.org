import { type JSX } from "react";
import Page from "./Page";

export default class MainPage extends Page
{
	static navName: string = "Main";
	static url: string = "/";

	render(): JSX.Element
	{
		return (
			<div>
				<h1>Hello World! This is Main.</h1>
			</div>
		);
	}
}
