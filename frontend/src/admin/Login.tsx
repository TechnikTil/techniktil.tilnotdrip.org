import { type JSX, type RefObject, useEffect, useEffectEvent, useRef, useState } from "react";
import { TechnikButton } from "../GlobalNodes";

export default function Login(): JSX.Element
{
  const usernameInput: RefObject<HTMLInputElement | null> = useRef(null);
  const passwordInput: RefObject<HTMLInputElement | null> = useRef(null);
  const [currentLog, setCurrentLog] = useState<string | null>(null);

  const submit: () => void = useEffectEvent(() =>
  {
    async function func(): Promise<void>
    {
      const username: string = usernameInput.current?.value ?? "";
      const passPlain: string = passwordInput.current?.value ?? "";

      const response: Response = await fetch(`/api/admin/login`, {
        body: JSON.stringify({username: username, password: passPlain}),
        headers: {"Content-Type": "application/json"},
        method: "POST"
      });

      setCurrentLog(`Login: ${await response.text()}`);
    }

    func().catch((e: unknown) =>
    {
      setCurrentLog(e?.toString() ?? "Unknown Error");
    });
  });

  useEffect(() =>
  {
    if (currentLog)
    {
      return;
    }
    fetch(`/api/admin/check`).then((i) => i.text()).then((text: string) =>
    {
      setCurrentLog(`Login Status: ${text}`);
    }).catch((e: unknown) =>
    {
      setCurrentLog(e?.toString() ?? "Unknown Error");
    });
  });

  return (
    <div className="centeredDiv">
      <div className="strawText">
        <input
          ref={usernameInput}
          type="text"
          placeholder="Input your username"
          className="strawTextInput adminLoginText"
        />
        <input
          ref={passwordInput}
          type="password"
          placeholder="Input your password"
          className="strawTextInput adminLoginText"
        />
        <div className="centeredDiv strawTextSubmit">
          <TechnikButton onClick={submit}>Login</TechnikButton>
        </div>
      </div>
      <div className="centered loginLog">{currentLog ?? "Pending..."}</div>
    </div>
  );
}
