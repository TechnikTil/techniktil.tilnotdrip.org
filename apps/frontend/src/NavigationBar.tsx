import { type JSX, type ReactNode } from "react";
import { Link, type Location, useLocation } from "react-router-dom";
import { PAGES } from ".";
import type Page from "./pages/Page";

export default function NavigationBar(): JSX.Element
{
	const location: Location = useLocation();

	const navigationElements: JSX.Element[] = PAGES.map((data: typeof Page, index: number, array: {}[]) =>
	{
		const isSelected: boolean = location.pathname == data.url;

		var navElement: ReactNode = <a>{data.navName}</a>;
		if (!isSelected) navElement = <Link className="yellow" to={data.url}>{data.navName}</Link>;

		return <span key={data.name}>[{navElement}]{index < array.length - 1 && " "}</span>;
	});

	return (
		<nav>
			<h2 className="centered" style={{fontWeight: "normal"}}>{navigationElements}</h2>
		</nav>
	);
}
