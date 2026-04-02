import { Component } from "react";
import { DEFAULT_TITLE } from "..";

export default class Page extends Component
{
	static navName: string;
	static url: string;
	static pageTitle: string;

	componentDidMount()
	{
		const specific: string = (this.constructor as typeof Page).pageTitle;

		document.title = specific ? `${DEFAULT_TITLE} - ${specific}` : DEFAULT_TITLE;
	}
}
