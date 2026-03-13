import { formatDistanceToNowStrict } from "date-fns";
import { Fragment, type JSX, useEffect, useState } from "react";
import { TechnikButton } from "../GlobalNodes";

export default function Straw(): JSX.Element
{
	const [strawDiv, setStrawDiv] = useState<JSX.Element>(<div className="loadingText">Loading...</div>);
	const [setupGimmicks, setupGimmicksValue] = useState<boolean>(true);

	useEffect(() =>
	{
		if (!setupGimmicks) return;

		fetch("/api/straw/list").then(i => i.json()).then((gimmicks: any[]) =>
		{
			let nodes: JSX.Element[] = [];
			gimmicks.forEach((data: any) =>
			{
				async function deleteGimmick(): Promise<void>
				{
					const response: Response = await fetch(`/api/straw/delete?id=${data.id}`, {method: "DELETE"});
					if (response.ok) setupGimmicksValue(true);
				}

				const date: Date = new Date(data.date);
				if (data.svg)
				{
					function download(): void
					{
						var hiddenElement: HTMLAnchorElement = document.createElement("a");
						hiddenElement.href = URL.createObjectURL(new Blob([data.svg], {type: "text/plain"}));
						hiddenElement.target = "_blank";
						hiddenElement.download = "image.svg";
						hiddenElement.click();
					}

					nodes.push(
						<div key={data.id} className="strawPanel">
							<WebsiteText />
							<div dangerouslySetInnerHTML={{__html: data.svg}} />
							<PreviewBottom date={date} download={download} trash={deleteGimmick} />
						</div>,
					);
				}
				else
				{
					nodes.push(
						<div key={data.id} className="strawPanel">
							<WebsiteText />
							<div className="centered strawPanelInnerText">"{data.text}"</div>
							<PreviewBottom date={date} trash={deleteGimmick} />
						</div>,
					);
				}

				setStrawDiv(<Fragment>{nodes}</Fragment>);
			});
		});

		setupGimmicksValue(false);
	}, [setupGimmicks]);

	return <div className="centeredDiv">{strawDiv}</div>;
}

const PANEL_ICONS = ["download", "trash"] as const;

function PreviewBottom(components: {date: Date; download?: () => void; trash?: () => void;}): JSX.Element
{
	const dateText: string = formatDistanceToNowStrict(components.date, {addSuffix: true});
	const icons: JSX.Element[] = [];

	PANEL_ICONS.forEach((id) =>
	{
		const action = components[id];
		if (!action) return;

		icons.push(<img key={id} src={`/images/panel/${id}.svg`} height="25px" onClick={_ => action()}></img>);
	});

	return (
		<div className="strawPanelBottom">
			<div>{dateText}</div>
			<div className="strawPanelIcons">{icons}</div>
		</div>
	);
}

function WebsiteText(): JSX.Element
{
	// Maybe add a constant to change the website?
	// It could be that I change the URL at some point.

	return (
		<div className="centered strawPanelWebsiteText">
			<TechnikButton href="https://techniktil.tilnotdrip.org">techniktil.tilnotdrip.org</TechnikButton>
		</div>
	);
}
