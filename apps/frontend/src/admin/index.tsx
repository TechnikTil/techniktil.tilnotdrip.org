import { Fragment, type JSX, useState } from "react";
import { TechnikButton } from "../GlobalNodes";
import Login from "./Login";
import Straw from "./Straw";
import "../styles/admin.css";
import "../styles/straw.css";

export default function Admin(): JSX.Element
{
	const [mode, setCurrentMode] = useState<string | null>(null);

	let node: JSX.Element = <Fragment />;

	switch (mode)
	{
		case "login":
			node = <Login />;
			break;
		case "straw":
			node = <Straw />;
			break;
	}

	return (
		<div>
			<div className="mainAdminContainer">
				<div className="centered adminPanelText">da admin peanel</div>
				<div className="centeredDiv adminPanelButtons">
					<TechnikButton fontSize="30px" onClick={() => setCurrentMode("login")}>Login</TechnikButton>
					<TechnikButton fontSize="30px" onClick={() => setCurrentMode("straw")}>Straw</TechnikButton>
				</div>
			</div>
			{node}
		</div>
	);
}
