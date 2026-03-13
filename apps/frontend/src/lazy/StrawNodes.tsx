import { type JSX, type RefObject, useCallback, useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { SketchPicker } from "react-color";
import { TechnikButton } from "../GlobalNodes";

export default function StrawNodes(): JSX.Element
{
	return (
		<div style={{width: "100%", marginTop: "120px", marginBottom: "220px"}}>
			<div style={{fontSize: 30}}>Go send me some stuff!</div>
			<div style={{gap: "20px", display: "flex"}}>
				<StrawDraw />
				<StrawText />
			</div>
		</div>
	);
}

export function StrawDraw(): JSX.Element
{
	const drawRef: RefObject<CanvasDraw | null> = useRef(null);

	const [drawColor, setDrawColor] = useState("#000000");
	const [drawSize, setDrawSize] = useState(4);
	const [isConfirming, setConfirmStatus] = useState(false);

	function submit(): void
	{
		if (!drawRef.current) return;

		const drawSaveString: string = drawRef.current.getSaveData();
		const drawSave: any = JSON.parse(drawSaveString) as {};

		if ((drawSave?.lines ?? []).length < 1) return;

		if (!isConfirming)
		{
			setConfirmStatus(true);
			return;
		}

		fetch("/api/straw/image", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({save: drawSave, timestamp: new Date().toISOString()}),
		});

		drawRef.current.clear();

		setConfirmStatus(false);
	}

	const hexRef: RefObject<HTMLDivElement | null> = useRef(null);
	const hexColorPicker: JSX.Element = (
		<div
			ref={hexRef}
			style={{
				position: "absolute",
				left: "50%",
				transform: "translateX(-50%)",
				width: "max-content",
				top: "120%",
				zIndex: 1000,
			}}
		>
			<SketchPicker disableAlpha color={drawColor} onChange={color => setDrawColor(color.hex)} />
		</div>
	);

	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const close = useCallback(() => setDropdownOpen(false), []);
	useClickOutside(hexRef, close);

	return (
		<div
			style={{
				width: "400px",
				height: "max-content",
				maxWidth: "90vw",
				backgroundColor: "#3e3e3e",
				padding: "10px",
				display: "table-cell",
			}}
		>
			<div
				style={{
					position: "relative",
					width: "max-content",
					display: "flex",
					marginBottom: "5px",
					marginLeft: "auto",
					marginRight: "auto",
					justifyContent: "center",
					alignItems: "center",
					gap: "5px",
				}}
			>
				<TechnikButton onClick={() => drawRef.current?.undo()} fontSize="20px">Undo</TechnikButton>
				<input
					type="range"
					name="Size"
					min="2"
					max="12"
					step="2"
					value={drawSize}
					onChange={event => setDrawSize(Number(event.currentTarget.value))}
				/>
				<div
					className="colorpicker"
					style={{backgroundColor: drawColor}}
					onClick={_ => setDropdownOpen(true)}
				/>
				<TechnikButton onClick={() => drawRef.current?.eraseAll()} fontSize="20px">Erase</TechnikButton>

				{isDropdownOpen && hexColorPicker}
			</div>
			<CanvasDraw
				canvasWidth={400}
				canvasHeight={400}
				ref={drawRef}
				hideGrid
				hideInterface
				brushColor={drawColor}
				brushRadius={drawSize}
			/>
			<div
				style={{
					marginTop: "5px",
					marginLeft: "auto",
					marginRight: "auto",
					width: "max-content",
					height: "auto",
				}}
			>
				<TechnikButton onClick={submit} fontSize="25px">
					{isConfirming ? "Are you sure?" : "Submit"}
				</TechnikButton>
			</div>
		</div>
	);
}

export function StrawText(): JSX.Element
{
	const inputRef: RefObject<HTMLInputElement | null> = useRef(null);
	const [isConfirming, setConfirmStatus] = useState(false);

	function submit(e: React.SubmitEvent): void
	{
		e.preventDefault();
		if (!inputRef.current?.value) return;

		if (!isConfirming)
		{
			setConfirmStatus(true);
			return;
		}

		fetch("/api/straw/text", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({text: inputRef.current.value, timestamp: new Date().toISOString()}),
		});

		inputRef.current.value = "";
		setConfirmStatus(false);
	}

	return (
		<form
			onSubmit={submit}
			style={{width: "max-content", height: "max-content", backgroundColor: "#3e3e3e", padding: "10px"}}
		>
			<input
				ref={inputRef}
				type="text"
				maxLength={256}
				placeholder="Send me a message!"
				style={{width: "380px", height: "25px", fontSize: "15px"}}
			/>
			<div style={{width: "max-content", marginTop: "5px", marginLeft: "auto", marginRight: "auto"}}>
				<TechnikButton>{isConfirming ? "Are you sure?" : "Submit"}</TechnikButton>
			</div>
		</form>
	);
}

function useClickOutside(ref: RefObject<any>, handler: () => void): void
{
	useEffect(() =>
	{
		let startedInside: boolean = false;
		let startedWhenMounted: boolean = false;

		const listener = (event: Event) =>
		{
			// Do nothing if `mousedown` or `touchstart` started inside ref element
			if (startedInside || !startedWhenMounted) return;
			// Do nothing if clicking ref's element or descendent elements
			if (!ref.current || ref.current.contains(event.target)) return;

			handler();
		};

		const validateEventStart = (event: Event) =>
		{
			startedWhenMounted = ref.current;
			startedInside = ref.current && ref.current.contains(event.target);
		};

		document.addEventListener("mousedown", validateEventStart);
		document.addEventListener("touchstart", validateEventStart);
		document.addEventListener("click", listener);

		return () =>
		{
			document.removeEventListener("mousedown", validateEventStart);
			document.removeEventListener("touchstart", validateEventStart);
			document.removeEventListener("click", listener);
		};
	}, [ref, handler]);
}
