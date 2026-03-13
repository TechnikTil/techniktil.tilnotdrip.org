import { Fragment, type JSX, useState } from "react";
import { TechnikButton } from "../GlobalNodes";
import Login from "./Login";
import Straw from "./Straw";

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
			<div
				style={{
					marginTop: "30px",
					width: "max-content",
					height: "max-content",
					marginLeft: "auto",
					marginRight: "auto",
				}}
			>
				<div className="centered" style={{fontSize: "40px"}}>da admin peanel</div>
				<div
					style={{
						width: "max-content",
						marginLeft: "auto",
						marginRight: "auto",
						marginTop: "5px",
						gap: "5px",
						display: "flex",
					}}
				>
					<TechnikButton fontSize="30px" onClick={() => setCurrentMode("login")}>Login</TechnikButton>
					<TechnikButton fontSize="30px" onClick={() => setCurrentMode("straw")}>Straw</TechnikButton>
				</div>
			</div>
			{node}
		</div>
	);
}
