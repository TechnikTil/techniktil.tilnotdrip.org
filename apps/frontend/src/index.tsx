import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter } from "react-router-dom";
import ApiCache from "./ApiCache.tsx";
import * as GlobalNodes from "./GlobalNodes.tsx";
import NavigationBar from "./NavigationBar.tsx";
import AboutMePage from "./pages/AboutMePage.tsx";
import MainPage from "./pages/MainPage.tsx";
import Page from "./pages/Page.tsx";
import ProjectsPage from "./pages/projects/ProjectsPage.tsx";
import SocialsPage from "./pages/SocialsPage.tsx";

export const PAGES: (typeof Page)[] = [MainPage, AboutMePage, ProjectsPage, SocialsPage];
export const DEFAULT_TITLE: string = "TechnikTil's Website";

async function main(): Promise<void>
{
	const rootElement: HTMLElement | null = document.getElementById("root");
	if (!rootElement)
	{
		const e: Error = new Error("Root element could not be found!");
		throw e;
	}

	try
	{
		await ApiCache.load();
	}
	catch (e: any)
	{
		console.error(e);
	}

	createRoot(rootElement).render(
		<StrictMode>
			<BrowserRouter>
				<GlobalNodes.WebsiteLogoText />
				<NavigationBar />
				<GlobalNodes.Pages />
				<GlobalNodes.WipDisclaimer />
			</BrowserRouter>
		</StrictMode>,
	);
}

void main();
