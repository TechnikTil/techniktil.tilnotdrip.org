import type { ComponentType, JSX } from "react";
import { Route, Routes } from "react-router-dom";
import { PAGES } from ".";
import type Page from "./pages/Page";

export function WebsiteLogoText(): JSX.Element
{
	return (
		<div className="centered" style={{marginTop: 15, fontWeight: "normal", fontSize: 50}}>TechnikTil's Website</div>
	);
}

export function Pages(): JSX.Element
{
	const routeElements: JSX.Element[] = PAGES.map((pageClass: typeof Page) =>
	{
		const ComponentClass: ComponentType = pageClass as ComponentType;
		return <Route path={pageClass.url ?? "/"} element={<ComponentClass />} />;
	});

	routeElements.push(<Route path="*" element={<NotFound />} />);

	return <Routes>{routeElements}</Routes>;
}

export function NotFound(): JSX.Element
{
	return (
		<div className="centered">
			<h1>Page Not Found!</h1>
			<h3 style={{fontWeight: "normal"}}>If this was on purpose, you can carry on...</h3>
		</div>
	);
}

export function WipDisclaimer(): JSX.Element
{
	// hehehe im so funny hehehehe
	const stuffAlright: string = Math.random() <= 0.1 ? "Shit" : "Stuff";

	return (
		<div id="disclaimer" style={{marginTop: 80, fontSize: 20}}>
			If you haven't noticed, this website is heavily Work in Progress. {stuffAlright} will probably change.
		</div>
	);
}
