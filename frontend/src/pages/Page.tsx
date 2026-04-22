/* eslint-disable @typescript-eslint/require-await */
import { Component } from "react";
import { DEFAULT_TITLE } from "..";

export default class Page extends Component
{
	static navName: string;
	static url: string;
	static pageTitle: string;

	static async shouldShow(): Promise<boolean>
	{
		return true;
	}

	componentDidMount()
	{
		const specific: string = (this.constructor as typeof Page).pageTitle;

		document.title = specific ? `${DEFAULT_TITLE} - ${specific}` : DEFAULT_TITLE;
	}
}
