import { type JSX, lazy, type LazyExoticComponent, Suspense, useEffect } from "react";
import Page from "./Page";
const Projects: LazyExoticComponent<() => JSX.Element> = lazy(() => import("../lazy/ProjectNodes.tsx"));

export default class ProjectsPage extends Page
{
	static navName: string = "Projects";
	static url: string = "/projects";
	static pageTitle: string = "Projects!";

	render(): JSX.Element
	{
		const loadingText: JSX.Element = <div className="centered projectLoadingText">If it loads, that is...</div>;
		return (
			<div>
				<this.CenterDisclaimer />
				<div className="pageHookTitle centered">Here are some of the things I have contributed to:</div>

				<Suspense fallback={loadingText}>
					<Projects />
				</Suspense>
			</div>
		);
	}

	CenterDisclaimer(): null
	{
		useEffect(() =>
		{
			const disclaimer: HTMLElement | null = document.getElementById("disclaimer");
			if (!disclaimer) return;

			disclaimer.className = "centered";

			return () =>
			{
				disclaimer.className = "";
			};
		});

		return null;
	}
}
