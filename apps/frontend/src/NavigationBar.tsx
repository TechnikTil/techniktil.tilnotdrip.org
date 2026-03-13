import { Fragment, type JSX, useEffect, useState } from "react";
import { type Location, type NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { PAGES } from ".";
import { TechnikButton } from "./GlobalNodes";
import type Page from "./pages/Page";

export default function NavigationBar(): JSX.Element
{
	const location: Location = useLocation();
	const navigate: NavigateFunction = useNavigate();

	const [includeAdmin, setIncludeAdmin] = useState<boolean>(false);

	useEffect(() =>
	{
		fetch("/api/admin/check").then((response: Response) =>
		{
			setIncludeAdmin(response.ok);
		});
	}, [location]);

	const navigationElements: JSX.Element[] = PAGES.map((data: typeof Page) =>
	{
		const isSelected: boolean = data.url == location.pathname;

		return (
			<TechnikButton
				onClick={() => navigate(data.url)}
				href={isSelected ? undefined : data.url}
				disabled={isSelected}
			>
				{data.navName}
			</TechnikButton>
		);
	});

	if (includeAdmin)
	{
		const isSelected: boolean = "/admin" == location.pathname;
		navigationElements.push(
			<TechnikButton
				onClick={() => navigate("/admin")}
				href={isSelected ? undefined : "/admin"}
				disabled={isSelected}
			>
				Admin
			</TechnikButton>,
		);
	}

	return <nav className="navBar">{navigationElements}</nav>;
}
