import { type ComponentType, type JSX, StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavigationBar from "./NavigationBar.tsx";
import AboutMePage from "./pages/AboutMePage.tsx";
import MainPage from "./pages/MainPage.tsx";
import Page from "./pages/Page.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import SocialsPage from "./pages/SocialsPage.tsx";

export const PAGES: (typeof Page)[] = [MainPage, AboutMePage, ProjectsPage, SocialsPage];
export const DEFAULT_TITLE: string = "TechnikTil's Website";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<WebsiteLogoText />
			<NavigationBar />
			<Pages />
			<WipDisclaimer />
		</BrowserRouter>
	</StrictMode>,
);

function WebsiteLogoText(): JSX.Element
{
	return (
		<div className="centered" style={{marginTop: 15, fontWeight: "normal", fontSize: 50}}>TechnikTil's Website</div>
	);
}

function Pages(): JSX.Element
{
	const routeElements: JSX.Element[] = PAGES.map((pageClass: typeof Page) =>
	{
		const ComponentClass: ComponentType = pageClass as ComponentType;
		return <Route path={pageClass.url ?? "/"} element={<ComponentClass />} />;
	});

	routeElements.push(<Route path="*" element={<NotFound />} />);

	return <Routes>{routeElements}</Routes>;
}

export function usePageTitle(info?: string)
{
	useEffect(() =>
	{
		document.title = "TechnikTil's Website";
		if (info) document.title += ` - ${info}`;
	}, [info]);
}

function NotFound(): JSX.Element
{
	return (
		<div className="centered">
			<h1>Page Not Found!</h1>
			<h3 style={{fontWeight: "normal"}}>If this was on purpose, you can carry on...</h3>
		</div>
	);
}

function WipDisclaimer(): JSX.Element
{
	// hehehe im so funny hehehehe
	const stuffAlright: string = Math.random() <= 0.1 ? "Shit" : "Stuff";

	return (
		<div style={{marginTop: 80, fontSize: 20}}>
			If you haven't noticed, this website is heavily Work in Progress. {stuffAlright} will probably change.
		</div>
	);
}
