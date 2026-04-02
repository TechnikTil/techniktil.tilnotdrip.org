import { Fragment, type JSX, useState } from "react";
import { TechnikButton } from "../GlobalNodes";
import Gimmick from "./Gimmick";
import Login from "./Login";
import "../styles/admin.css";
import "../styles/straw.css";

const OPTIONS = [{name: "Login", element: <Login />}, {name: "Gimmick", element: <Gimmick />}] as const;

export default function Admin(): JSX.Element
{
	const [mode, setCurrentMode] = useState<string | null>(null);

	const buttons: JSX.Element[] = [];
	let node: JSX.Element = <Fragment />;

	OPTIONS.forEach(({name, element}) =>
	{
		const isSelected: boolean = mode == name;
		buttons.push(
			<TechnikButton
				key={name}
				fontSize="30px"
				disabled={isSelected}
				onClick={() =>
				{
					setCurrentMode(name);
				}}
			>
				{name}
			</TechnikButton>,
		);
		if (isSelected) node = element;
	});

	return (
		<div>
			<div className="mainAdminContainer">
				<div className="centered adminPanelText">Welcome to the "Admin Peanel"</div>
				<div className="centeredDiv adminPanelButtons">{buttons}</div>
			</div>
			{node}
		</div>
	);
}
