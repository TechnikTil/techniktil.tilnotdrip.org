import { formatDistanceToNowStrict } from "date-fns";
import { Fragment, type JSX, useEffect, useState } from "react";
import { TechnikButton } from "../GlobalNodes";

export default function Gimmick(): JSX.Element
{
  const [gimmickDiv, setGimmickDiv] = useState<JSX.Element>(<div className="loadingText">Loading...</div>);
  const [setupGimmicks, setupGimmicksValue] = useState<boolean>(true);

  useEffect(() =>
  {
    if (!setupGimmicks)
    {
      return;
    }

    async function init(): Promise<void>
    {
      const response: Response = await fetch("/api/gimmick/list");
      const gimmicks: GimmickData[] = (await response.json()) as GimmickData[];

      const nodes: JSX.Element[] = gimmicks.map((data) => (
        <GimmickObject
          data={data}
          onDelete={() =>
          {
            setupGimmicksValue(true);
          }}
        />
      ));
      setGimmickDiv(<Fragment>{nodes}</Fragment>);
    }

    void init();
    setupGimmicksValue(false);
  }, [setupGimmicks]);

  return <div className="centeredDiv">{gimmickDiv}</div>;
}

export function GimmickObject(components: {data: GimmickData; onDelete: () => void;}): JSX.Element
{
  const {data, onDelete} = components;

  function deleteGimmick(): void
  {
    fetch(`/api/gimmick/delete/${data.id}`, {method: "DELETE"}).then((response: Response) =>
    {
      if (response.ok)
      {
        onDelete();
      }
    }).catch((reason: unknown) =>
    {
      console.error(reason);
    });
  }

  const downloadSVG: (() => void) | undefined = data.svg ?
    () =>
    {
      download(data.svg ?? "");
    } :
    undefined;

  const content: JSX.Element = data.svg ?
    <div dangerouslySetInnerHTML={{__html: data.svg}} /> :
    <div className="centered strawPanelInnerText">"{data.text}"</div>;

  return (
    <div key={data.id} className="strawPanel">
      <WebsiteText />
      {content}
      <PreviewBottom date={data.date} download={downloadSVG} trash={deleteGimmick} />
    </div>
  );
}

const PANEL_ICONS = ["download", "trash"] as const;

function PreviewBottom(components: {date: Date; download?: () => void; trash?: () => void;}): JSX.Element
{
  const dateText: string = formatDistanceToNowStrict(components.date, {addSuffix: true});
  const icons: JSX.Element[] = [];

  PANEL_ICONS.forEach((id) =>
  {
    const action = components[id];
    if (!action)
    {
      return;
    }

    icons.push(
      <img
        key={id}
        src={`/images/panel/${id}.svg`}
        height="25px"
        onClick={() =>
        {
          action();
        }}
      >
      </img>
    );
  });

  return (
    <div className="strawPanelBottom">
      <div>{dateText}</div>
      <div className="strawPanelIcons">{icons}</div>
    </div>
  );
}

interface GimmickData
{
  id: string;
  text: string | null;
  svg: string | null;
  date: Date;
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

function download(text: string): void
{
  const hiddenElement: HTMLAnchorElement = document.createElement("a");
  hiddenElement.href = URL.createObjectURL(new Blob([text], {type: "text/plain"}));
  hiddenElement.target = "_blank";
  hiddenElement.download = "image.svg";
  hiddenElement.click();
  document.removeChild(hiddenElement);
}
