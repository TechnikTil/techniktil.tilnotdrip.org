import { type JSX, type RefObject, useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import { TechnikButton } from "./GlobalNodes";
import "./styles/straw.css";
import CanvasDraw, { type CanvasDrawHandle } from "./CanvasDraw";

export default function StrawNodes(): JSX.Element
{
	const gimmickContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
	const [isGimmickOpen, setGimmickOpen] = useState(false);

	const gimmickContainer: JSX.Element = (
		<div className="strawNodeContainer" ref={gimmickContainerRef}>
			<StrawDraw />
			<StrawText />
		</div>
	);

	return (
		<div className="strawContainer">
			<div
				className="strawHookTitle"
				onClick={() =>
				{
					setGimmickOpen(!isGimmickOpen);
				}}
			>
				<span>Go send me some stuff!</span> <span className={isGimmickOpen ? "arrowDown" : ""}>&gt;</span>
			</div>
			{isGimmickOpen && gimmickContainer}
		</div>
	);
}

export function StrawDraw(): JSX.Element
{
	const drawRef: RefObject<CanvasDrawHandle | null> = useRef(null);

	const [drawColor, setDrawColor] = useState("#000000");
	const [drawSize, setDrawSize] = useState(4);
	const [isConfirming, setConfirmStatus] = useState(false);

	function submit(): void
	{
		if (!drawRef.current) return;

		if (!isConfirming)
		{
			setConfirmStatus(true);
			return;
		}

		const svg: string | undefined = drawRef.current.getSVG();
		if (!svg) return;

		void fetch("/api/gimmick/image", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({svg, timestamp: new Date().toISOString()}),
		});

		drawRef.current.clear(true);

		setConfirmStatus(false);
	}

	const hexRef: RefObject<HTMLDivElement | null> = useRef(null);
	const hexColorPicker: JSX.Element = (
		<div ref={hexRef} className="colorpickerFull">
			<SketchPicker
				disableAlpha
				color={drawColor}
				onChange={color =>
				{
					setDrawColor(color.hex);
				}}
			/>
		</div>
	);

	const [isDropdownOpen, setDropdownOpen] = useState(false);

	useClickOutside(hexRef as RefObject<HTMLElement>, () =>
	{
		setDropdownOpen(false);
	});

	return (
		<div className="strawDraw">
			<div className="strawDrawController">
				<TechnikButton onClick={() => drawRef.current?.undo()} fontSize="20px">Undo</TechnikButton>
				<input
					type="range"
					name="Size"
					min="2"
					max="12"
					step="2"
					value={drawSize}
					onChange={event =>
					{
						setDrawSize(Number(event.currentTarget.value));
					}}
				/>
				<div
					className="colorpicker"
					style={{backgroundColor: drawColor}}
					onClick={() =>
					{
						setDropdownOpen(true);
					}}
				/>
				<TechnikButton onClick={() => drawRef.current?.clear(false)} fontSize="20px">Erase</TechnikButton>

				{isDropdownOpen && hexColorPicker}
			</div>
			<CanvasDraw
				width={400}
				height={400}
				bgColor="#ffffff"
				strokeColor={drawColor}
				strokeRadius={drawSize}
				style={{maxWidth: "99%", height: "auto"}}
				ref={drawRef}
			/>
			<div className="strawSubmit">
				<TechnikButton onClick={submit} fontSize="20px">
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

	function submit(e?: React.SubmitEvent): void
	{
		e?.preventDefault();
		if (!inputRef.current?.value) return;

		if (!isConfirming)
		{
			setConfirmStatus(true);
			return;
		}

		void fetch("/api/gimmick/text", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({text: inputRef.current.value, timestamp: new Date().toISOString()}),
		});

		inputRef.current.value = "";
		setConfirmStatus(false);
	}

	return (
		<div className="strawText">
			<input
				ref={inputRef}
				type="text"
				maxLength={256}
				placeholder="Send me a message!"
				className="strawTextInput"
			/>
			<div className="strawSubmit">
				<TechnikButton onClick={submit} fontSize="20px">
					{isConfirming ? "Are you sure?" : "Submit"}
				</TechnikButton>
			</div>
		</div>
	);
}

function useClickOutside(ref: RefObject<HTMLElement | undefined>, handler: () => void): void
{
	useEffect(() =>
	{
		if (!ref.current) return;

		let startedInside = false;
		let startedWhenMounted: HTMLElement | undefined = undefined;

		const listener = (event: Event) =>
		{
			// Do nothing if `mousedown` or `touchstart` started inside ref element
			if (startedInside || !startedWhenMounted) return;
			// Do nothing if clicking ref's element or descendent elements
			if (ref.current?.contains(event.target as Node | null)) return;

			handler();
		};

		const validateEventStart = (event: Event) =>
		{
			if (!event.target) return;
			startedWhenMounted = ref.current;
			startedInside = ref.current?.contains(event.target as Node | null) ?? false;
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
