import { Fragment, type JSX } from "react";
import ApiCache from "../ApiCache";
import Page from "./Page";

export default class MainPage extends Page
{
	static navName: string = "Main";
	static url: string = "/";

	render(): JSX.Element
	{
		return (
			<div>
				<div style={{marginTop: 45, fontSize: 30}}>
					<this.RandomGreeting /> Welcome to my website!
				</div>
				<div style={{marginTop: 15, fontSize: 25}}>
					My good buddy ol' pal CrusherNotDrip decided to make a website about him, so he wouldn't need to
					cram his about-me in every social media site possible. I thought that was a genius idea, so I
					decided I was gonna{"  "}<span className="thick-strike">steal</span>{"  "}
					borrow that idea from him, and make a website about me too.
				</div>
			</div>
		);
	}

	RandomGreeting(): JSX.Element | null
	{
		if (ApiCache.greetingList == undefined) return <Fragment />;

		const index: number = Math.floor(Math.random() * ApiCache.greetingList.length);
		return <span>{ApiCache.greetingList[index]}</span>;
	}
}
