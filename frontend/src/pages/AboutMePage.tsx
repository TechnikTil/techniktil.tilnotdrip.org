import { Fragment, type JSX, useEffect, useState } from "react";
import ApiCache from "../ApiCache";
import Page from "./Page";

const GITHUB_LINK = "https://github.com/TechnikTil";
const BIRTHDAY: number = Date.UTC(2010, 8, 24);

export default class AboutMePage extends Page
{
  static navName = "About Me";
  static url = "/aboutMe";
  static pageTitle = "About Me!";

  render(): JSX.Element
  {
    const fnf: JSX.Element = <a href="https://www.newgrounds.com/portal/view/770371">fnf</a>;

    return (
      <div className="aboutMe">
        <div className="pageHookTitle">About Me:</div>

        <ul>
          <this.GetAge />
          <li>A "Straight White Man" (scary)</li>
          <li>
            i liek <span className="yellow">yellowe</span> :)
          </li>
          <li>Born in Germany, moved to Canada in 2020!</li>
          <li>
            <a href={GITHUB_LINK}>i code</a> (shocker)
          </li>
          <this.GetTimeZone />
          <li>i try to draw, but suck at it</li>
          <li>
            i made music <span className="aboutMeOnceAdjust">once</span>
          </li>
          <li>{fnf} is love, {fnf} is life</li>
          <li>will probably be a basement dweller for a living</li>
          <li>
            In a Discord Group Chat called "
            <span className="cc1Text">Couples Counseling #2</span>" (don't ask)
          </li>
        </ul>
      </div>
    );
  }

  GetAge(): JSX.Element
  {
    const date: Date = new Date(BIRTHDAY);
    const timeSinceDate: Date = new Date(Date.now() - BIRTHDAY);

    const age: number = timeSinceDate.getUTCFullYear() - 1970;
    const birthday: string = date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
    return <li>{age} years old ({birthday})</li>;
  }

  GetTimeZone(): JSX.Element
  {
    const [timeZoneData, setTimeZoneData] = useState<TimeZoneData | null>(null);
    const [now, setNow] = useState<Date>(new Date());

    useEffect(() =>
    {
      const milisecondsElapsed: number = now.getUTCMilliseconds();
      const timer: number = window.setInterval(() =>
      {
        setNow(new Date());
      }, 1000 - milisecondsElapsed);

      return () =>
      {
        clearInterval(timer);
      };
    });

    useEffect(() =>
    {
      ApiCache.getReact("/api/data/timezone", setTimeZoneData);
    });

    if (!timeZoneData)
    {
      return <Fragment />;
    }

    const date: Date = new Date(now);
    date.setUTCMinutes(date.getUTCMinutes() - timeZoneData.offset);

    const timeDisplay: string = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC"
    });
    return <li>My Timezone is {timeZoneData.name}! (so it's {timeDisplay} for me)</li>;
  }
}

interface TimeZoneData
{
  name: string;
  offset: number;
  timestamp: string;
}
