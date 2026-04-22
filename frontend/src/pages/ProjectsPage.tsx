import { Fragment, type JSX, useEffect, useState } from "react";
import ApiCache from "../ApiCache";
import { TechnikButton } from "../GlobalNodes";
import Page from "./Page";

export default class ProjectsPage extends Page
{
	static navName = "Projects";
	static url = "/projects";
	static pageTitle = "Projects!";

	render(): JSX.Element
	{
		return (
			<div>
				<this.CenterDisclaimer />
				<div className="pageHookTitle centered">Here are some of the things I have contributed to:</div>
				<this.List />
			</div>
		);
	}

	List(): JSX.Element[]
	{
		const [data, setData] = useState<ProjectsData[] | null>(null);

		useEffect(() =>
		{
			ApiCache.getReact("/api/data/projects", setData);
		});

		return (data ?? []).map(value =>
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
