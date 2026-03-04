import { type JSX } from "react";
import Page from "./Page";

export default class ProjectsPage extends Page
{
	static navName: string = "Projects";
	static url: string = "/projects";

	render(): JSX.Element
	{
		return (
			<div>
				<h1>Hello World! This is Projects.</h1>
			</div>
		);
	}
}
