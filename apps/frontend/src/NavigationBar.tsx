import { type JSX, useEffect, useState } from "react";
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
		if (includeAdmin) return;
		fetch("/api/admin/check").then(i => setIncludeAdmin(i.ok));
	}, [location]);

	const navigationElements: JSX.Element[] = PAGES.map((data: typeof Page) =>
	{
		const isSelected: boolean = data.url == location.pathname;

		return (
			<TechnikButton key={data.url} onClick={() => navigate(data.url)} href={data.url} disabled={isSelected}>
				{data.navName}
			</TechnikButton>
		);
	});

	if (includeAdmin)
	{
		// TODO: Make this better. Maybe PAGES should check for admin instead? That way this wouldn't be needed at all!
		const isSelected: boolean = "/admin" == location.pathname;
		navigationElements.push(
			<TechnikButton
				key="/admin"
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
