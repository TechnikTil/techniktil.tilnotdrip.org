import { Fragment, type JSX, lazy, type LazyExoticComponent, Suspense } from "react";
import { TechnikButton } from "../GlobalNodes";
import "../styles/admin.css";
import "../styles/straw.css";
import Page from "../pages/Page";

const Gimmick: LazyExoticComponent<() => JSX.Element> = lazy(() => import("./Gimmick"));
const Login: LazyExoticComponent<() => JSX.Element> = lazy(() => import("./Login"));

const OPTIONS = [{name: "Login", element: <Login />}, {name: "Gimmick", element: <Gimmick />}] as const;

export default class AdminRoute extends Page
{
	static navName = "Admin";
	static url = "/admin";
	static pageTitle = "Admin Peanel";

	state: {mode: string | null;} = {mode: null};

	render(): JSX.Element
	{
		const buttons: JSX.Element[] = [];
		let node: JSX.Element = <Fragment />;

		OPTIONS.forEach(({name, element}) =>
		{
			const isSelected: boolean = this.state.mode == name;
			buttons.push(
				<TechnikButton
					key={name}
					fontSize="30px"
					disabled={isSelected}
					onClick={() =>
					{
						this.setState({mode: name});
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
				<Suspense>{node}</Suspense>
			</div>
		);
	}

	static async shouldShow(): Promise<boolean>
	{
		const response: Response = await fetch("/api/admin/check");
		return response.ok;
	}
}
