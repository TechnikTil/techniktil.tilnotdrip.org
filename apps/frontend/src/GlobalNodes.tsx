import type { Property } from "csstype";
import { type ComponentType, type JSX, lazy, type LazyExoticComponent, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PAGES } from ".";
import type Page from "./pages/Page";
const Admin: LazyExoticComponent<() => JSX.Element> = lazy(() => import("./admin"));

export function WebsiteLogoText(): JSX.Element
{
	return <div className="centered websiteTitle">TechnikTil's Website</div>;
}

export function Pages(): JSX.Element
{
	const routeElements: JSX.Element[] = PAGES.map((pageClass: typeof Page) =>
	{
		const ComponentClass: ComponentType = pageClass as ComponentType;
		return <Route path={pageClass.url ?? "/"} element={<ComponentClass />} />;
	});

	routeElements.push(<Route path="*" element={<NotFound />} />);
	routeElements.push(
		<Route
			path="/admin"
			element={
				<Suspense>
					<Admin />
				</Suspense>
			}
		/>,
	);

	return <Routes>{routeElements}</Routes>;
}

export function NotFound(): JSX.Element
{
	return (
		<div className="centered">
			<h1>Page Not Found!</h1>
			<h3 className="normalWeight">If this was on purpose, you can carry on...</h3>
		</div>
	);
}

export function WipDisclaimer(): JSX.Element
{
	// hehehe im so funny hehehehe
	const stuffAlright: string = Math.random() <= 0.1 ? "Shit" : "Stuff";

	return (
		<div className="disclaimer">
			If you haven't noticed, this website is heavily Work in Progress. {stuffAlright} will probably change.
		</div>
	);
}

export function TechnikButton(
	components: {
		children: string;
		disabled?: boolean;
		href?: string;
		onClick?: () => void;
		fontSize?: Property.FontSize;
	},
): JSX.Element
{
	function onClickHandler(event: React.MouseEvent): void
	{
		if (components.onClick)
		{
			event.preventDefault();
			components.onClick();
		}
	}

	let href: string | undefined = components.href;
	if (!href) href = "#";
	if (components.disabled) href = undefined;

	let className: string | undefined = "yellow";
	if (components.disabled) className = undefined;

	return (
		<div className="normalWeight" style={{fontSize: components.fontSize}}>
			[<a className={className} href={href} onClick={onClickHandler}>{components.children}</a>]
		</div>
	);
}
