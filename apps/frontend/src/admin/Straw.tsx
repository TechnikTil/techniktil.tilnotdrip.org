import { formatDistanceToNowStrict } from "date-fns";
import { Fragment, type JSX, useEffect, useEffectEvent, useState } from "react";
import { TechnikButton } from "../GlobalNodes";

export default function Straw(): JSX.Element
{
	const [loggedIn, setStatus] = useState(false);
	const [setupGimmicks, setupGimmicksValue] = useState<boolean>(true);

	const [strawDiv, setStrawDiv] = useState<JSX.Element>(<div style={{fontSize: "30px"}}>Loading...</div>);

	useEffect(() =>
	{
		console.log(setupGimmicks);
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
						<div key={data.id} className="strawPreview">
							<div className="centered" style={{paddingBottom: "6px"}}>
								<TechnikButton href="https://techniktil.tilnotdrip.org">
									techniktil.tilnotdrip.org
								</TechnikButton>
							</div>
							<div dangerouslySetInnerHTML={{__html: data.svg}} />
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									width: "100%",
								}}
							>
								<div>{formatDistanceToNowStrict(date, {addSuffix: true})}</div>
								<div style={{display: "flex", gap: "15px", cursor: "pointer"}}>
									<img src="/images/panel/download.svg" height="25px" onClick={_ => download()} />
									<img src="/images/panel/trash.svg" height="25px" onClick={_ => deleteGimmick()} />
								</div>
							</div>
						</div>,
					);
				}
				else
				{
					nodes.push(
						<div key={data.id} className="strawPreview">
							<div className="centered" style={{paddingBottom: "6px"}}>
								<TechnikButton href="https://techniktil.tilnotdrip.org">
									techniktil.tilnotdrip.org
								</TechnikButton>
							</div>
							<div className="strawPreviewText">"{data.text}"</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									width: "100%",
								}}
							>
								<div>{formatDistanceToNowStrict(date, {addSuffix: true})}</div>
								<div style={{display: "flex", gap: "15px", cursor: "pointer"}}>
									<img src="/images/panel/trash.svg" height="25px" onClick={_ => deleteGimmick()} />
								</div>
							</div>
						</div>,
					);
				}

				setStrawDiv(<Fragment>{nodes}</Fragment>);
				setupGimmicksValue(false);
			});
		});
	}, [setupGimmicks]);

	return (
		<div
			style={{
				margin: "10px",
				marginLeft: "auto",
				marginRight: "auto",
				width: "max-content",
				height: "max-content",
			}}
		>
			{strawDiv}
		</div>
	);
}
