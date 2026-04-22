import { Fragment, type JSX, useEffect } from "react";
import ApiCache from "../ApiCache.tsx";
import { TechnikButton } from "../GlobalNodes.tsx";
import Page from "./Page.tsx";

export default class ProjectsPage extends Page
{
	static navName = "Projects";
	static url = "/projects";
	static pageTitle = "Projects!";

	render(): JSX.Element
	{
		const data: ProjectsData[] | undefined = ApiCache.get("/api/data/projects") as ProjectsData[] | undefined;

		const projects: JSX.Element[] = (data ?? []).map(value =>
		{
			const downloadNodes: JSX.Element[] = value.downloads.map(
				(download: ProjectDownload, index: number, array: ProjectDownload[]) =>
				{
					return (
						<Fragment key={`${download.name}-${value.name}`}>
							<span>
								<TechnikButton href={download.url}>{download.name}</TechnikButton>
							</span>
							{index < array.length - 1 && " "}
						</Fragment>
					);
				},
			);

			return (
				<div key={value.name} className="centeredDiv centered project">
					<img src={`images/projects/${value.image}`} className="projectImage" />
					<div className="projectName">{value.name}</div>
					<div className="projectDescription" dangerouslySetInnerHTML={{__html: value.html}} />
					<div className="projectLinks">{downloadNodes}</div>
				</div>
			);
		});

		return (
			<div>
				<this.CenterDisclaimer />
				<div className="pageHookTitle centered">Here are some of the things I have contributed to:</div>

				{projects}
			</div>
		);
	}

	CenterDisclaimer(): null
	{
		useEffect(() =>
		{
			const disclaimers: HTMLElement[] = Array.from(
				document.getElementsByClassName("disclaimer"),
			) as HTMLElement[];

			disclaimers.forEach((element: HTMLElement) =>
			{
				element.classList.add("centered");
			});

			return () =>
			{
				disclaimers.forEach((element: HTMLElement) =>
				{
					element.classList.remove("centered");
				});
			};
		});

		return null;
	}
}

interface ProjectsData
{
	name: string;
	image: string;
	downloads: ProjectDownload[];
	html: string;
}

interface ProjectDownload
{
	name: string;
	url: string;
}
