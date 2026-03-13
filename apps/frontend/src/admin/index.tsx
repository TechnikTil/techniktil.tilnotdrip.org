import { Fragment, type JSX, useState } from "react";
import { TechnikButton } from "../GlobalNodes";
import Login from "./Login";
import Straw from "./Straw";
import "../styles/admin.css";
import "../styles/straw.css";

const OPTIONS = [{id: "login", name: "Login", element: <Login />}, {
	id: "straw",
	name: "Straw",
	element: <Straw />,
}] as const;

export default function Admin(): JSX.Element
{
	const [mode, setCurrentMode] = useState<string | null>(null);

	const buttons: JSX.Element[] = [];
	let node: JSX.Element = <Fragment />;

	OPTIONS.forEach(({id, name, element}) =>
	{
		const isSelected: boolean = mode == id;
		buttons.push(
			<TechnikButton key={id} fontSize="30px" disabled={isSelected} onClick={() => setCurrentMode(id)}>
				{name}
			</TechnikButton>,
		);
		if (isSelected) node = element;
	});

	return (
		<div>
			<div className="mainAdminContainer">
				<div className="centered adminPanelText">da admin peanel</div>
				<div className="centeredDiv adminPanelButtons">{buttons}</div>
			</div>
			{node}
		</div>
	);
}
