import { hash } from "bcryptjs";
import { getReasonPhrase } from "http-status-codes";
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

			const saltResponse: Response = await fetch(`/api/admin/salt/${username}`);
			setCurrentLog(`Salt: ${getReasonPhrase(saltResponse.status)}`);
			if (!saltResponse.ok) return;

			const salt: string = await saltResponse.text();
			const passHash: string = await hash(passPlain, salt);

			const response: Response = await fetch(`/api/admin/login`, {
				body: JSON.stringify({username: usernameInput.current?.value, hash: passHash}),
				headers: {"Content-Type": "application/json"},
				method: "POST",
			});

			setCurrentLog(`Login: ${await response.text()}`);
		}

		func().catch(e => setCurrentLog(e.toString()));
	});

	useEffect(() =>
	{
		if (currentLog) return;
		fetch(`/api/admin/check`).then(i => i.text()).then((text: string) => setCurrentLog(`Login Status: ${text}`));
	});

	return (
		<div style={{width: "max-content", height: "max-content", marginLeft: "auto", marginRight: "auto"}}>
			<div style={{width: "max-content", height: "max-content", backgroundColor: "#7272729d", padding: "10px"}}>
				<input
					ref={usernameInput}
					type="text"
					placeholder="Input your username"
					style={{width: "380px", height: "25px", fontSize: "15px"}}
				/>
				<input
					ref={passwordInput}
					type="password"
					placeholder="Input your password"
					style={{width: "380px", height: "25px", fontSize: "15px"}}
				/>
				<div style={{width: "max-content", marginTop: "5px", marginLeft: "auto", marginRight: "auto"}}>
					<TechnikButton onClick={submit}>Login</TechnikButton>
				</div>
			</div>
			<div style={{marginTop: "10px", width: "100%", maxWidth: "100%", textAlign: "center", fontSize: "40px"}}>
				{currentLog ? currentLog : "Pending..."}
			</div>
		</div>
	);
}
