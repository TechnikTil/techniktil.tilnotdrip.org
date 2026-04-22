import { type JSX, useEffect, useState } from "react";
import { type Location, type NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { TechnikButton } from "./GlobalNodes";
import { PAGES } from "./pages";
import type Page from "./pages/Page";

export default function NavigationBar(): JSX.Element
{
	const location: Location = useLocation();
	const navigate: NavigateFunction = useNavigate();

	const [allowedList, setList] = useState<Set<string>>(new Set<string>());

	const navigationElements: JSX.Element[] = [];

	useEffect(() =>
	{
		async function func(data: typeof Page): Promise<void>
		{
			const shouldShow: boolean = await data.shouldShow();
			const addToList: boolean = shouldShow !== allowedList.has(data.url);

			setList(oldList =>
			{
				const list: Set<string> = new Set<string>(oldList);

				if (addToList)
				{
					list.add(data.url);
				}
				else
				{
					list.delete(data.url);
				}

				return list;
			});
		}

		setList(new Set<string>());
		void Promise.all(PAGES.map(v => func(v)));
	}, []);

	PAGES.forEach((data: typeof Page) =>
	{
		const isSelected: boolean = data.url == location.pathname;
		if (!allowedList.has(data.url)) return;

		navigationElements.push(
			<TechnikButton key={data.url} onClick={() => void navigate(data.url)} href={data.url} disabled={isSelected}>
				{data.navName}
			</TechnikButton>,
		);
	});

	return <nav className="navBar">{navigationElements}</nav>;
}
