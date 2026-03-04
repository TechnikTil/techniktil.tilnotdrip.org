import { type ComponentType, type JSX, StrictMode } from "react";
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

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<NavigationBar />
			<Pages />
		</BrowserRouter>
	</StrictMode>,
);

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

function NotFound(): JSX.Element
{
	return (
		<div className="centered">
			<h1>Page Not Found!</h1>
			<h3 style={{fontWeight: "normal"}}>If this was on purpose, you can carry on...</h3>
		</div>
	);
}
