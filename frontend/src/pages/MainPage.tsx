import { Fragment, type JSX, lazy, type LazyExoticComponent, Suspense, useEffect, useState } from "react";
import ApiCache from "../ApiCache";
import Page from "./Page";
const StrawNodes: LazyExoticComponent<() => JSX.Element> = lazy(() => import("../StrawNodes.tsx"));

export default class MainPage extends Page
{
	static navName = "Main";
	static url = "/";

	render(): JSX.Element
	{
		return (
			<div>
				<div className="pageHookTitle">
					<this.RandomGreeting /> Welcome to my website!
				</div>
				<div className="mainExplanationText">
					My good buddy ol' pal CrusherNotDrip decided to make a website about him, so he wouldn't need to
					cram his about-me in every social media site possible. I thought that was a genius idea, so I
					decided I was gonna{"  "}<span className="thickStrike">steal</span>{"  "}
					borrow that idea from him, and make a website about me too.
				</div>

				<Suspense>
					<StrawNodes />
				</Suspense>
			</div>
		);
	}

	RandomGreeting(): JSX.Element | null
	{
		const [greetingList, setGreetingList] = useState<string[] | null>(null);

		useEffect(() =>
		{
			ApiCache.getReact("/api/data/greetings", setGreetingList);
		});

		if (!greetingList || greetingList.length < 1) return <Fragment />;

		const index: number = Math.floor(Math.random() * greetingList.length);
		return <span>{greetingList[index]}</span>;
	}
}
