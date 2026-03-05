import { type JSX, useEffect, useState } from "react";
import React from "react";
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
					decided I was gonna <span className="goodStrike">steal</span>{" "}
					borrow that idea from him, and make a website about me too.
				</div>
			</div>
		);
	}

	RandomGreeting(): JSX.Element | null
	{
		const [list, setList] = useState<string[] | undefined>(undefined);

		useEffect(() =>
		{
			if (list != undefined) return;

			const updateList: () => Promise<void> = async () =>
			{
				const response: Response = await fetch("/assets/data/greetings.txt");
				let text: string = await response.text();
				text = text.trim();
				setList(text.split("\n"));
			};

			updateList();
		});

		if (list == undefined) return <React.Fragment />;

		const index: number = Math.floor(Math.random() * list.length);
		return <span>{list[index]}</span>;
	}
}
