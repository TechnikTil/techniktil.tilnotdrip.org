import {
	Component,
	createRef,
	type CSSProperties,
	type JSX,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { SketchPicker } from "react-color";
import { TechnikButton } from "./GlobalNodes";
import "./styles/straw.css";
import { type ArrayXY, Polyline, SVG, type Svg } from "@svgdotjs/svg.js";
import { LazyBrush, type Point } from "lazy-brush";

export default function StrawNodes(): JSX.Element
{
	return (
		<div className="strawContainer">
			<div className="strawHookTitle">Go send me some stuff!</div>
			<div className="strawNodeContainer">
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
	const close = useCallback(() =>
	{
		setDropdownOpen(false);
	}, []);

	if (hexRef.current != null) useClickOutside(hexRef as RefObject<HTMLElement>, close);

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
				style={{maxWidth: "99%", height: "auto"}}
				ref={drawRef}
				strokeColor={drawColor}
				strokeWidth={drawSize}
				color="white"
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
		<form onSubmit={submit} className="strawText">
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
		</form>
	);
}

function useClickOutside(ref: RefObject<HTMLElement>, handler: () => void): void
{
	useEffect(() =>
	{
		let startedInside = false;
		let startedWhenMounted: HTMLElement | undefined = undefined;

		const listener = (event: Event) =>
		{
			// Do nothing if `mousedown` or `touchstart` started inside ref element
			if (startedInside || !startedWhenMounted) return;
			// Do nothing if clicking ref's element or descendent elements
			if (ref.current.contains(event.target as Node | null)) return;

			handler();
		};

		const validateEventStart = (event: Event) =>
		{
			if (!event.target) return;
			startedWhenMounted = ref.current;
			startedInside = ref.current.contains(event.target as Node | null);
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

/**
 * A canvas you can draw on.
 * Heavily based off of `react-canvas-draw`.
 */
export class CanvasDraw extends Component<CanvasProps, CanvasState>
{
	props: CanvasProps = {width: 400, height: 400, color: "white", style: {}, strokeColor: "black", strokeWidth: 4};
	state: CanvasState = {history: [[]]};

	history!: CanvasLine[][];
	svgRef: RefObject<SVGSVGElement | null> = createRef();
	canvas?: Svg;
	lazyBrush: LazyBrush = new LazyBrush({enabled: false});
	activeLine?: Polyline;

	getSVG(): string | undefined
	{
		this.updateSVG();
		return this.canvas?.svg();
	}

	undo(): void
	{
		if (this.history.length > 1) this.history.shift();
		this.updateHistory();
	}

	clear(removeHistory = false): void
	{
		if (removeHistory)
		{
			this.history = [[]];
		}
		else
		{
			this.history.unshift([]);
		}

		this.updateHistory();
	}

	render(): JSX.Element
	{
		this.history = this.state.history;

		return (
			<svg
				style={{...this.props.style, touchAction: "none"}}
				viewBox={`0 0 ${String(this.props.width)} ${String(this.props.height)}`}
				width={this.props.width}
				height={this.props.height}
				ref={this.svgRef}
				onMouseDown={e =>
				{
					this.startDraw(e);
				}}
				onMouseMove={e =>
				{
					this.draw(e);
				}}
				onMouseUp={e =>
				{
					this.endDraw(e);
				}}
				onMouseLeave={e =>
				{
					this.endDraw(e);
				}}
				onTouchStart={e =>
				{
					this.startDraw(e);
				}}
				onTouchMove={e =>
				{
					this.draw(e);
				}}
				onTouchEnd={e =>
				{
					this.endDraw(e);
				}}
				onTouchCancel={e =>
				{
					this.endDraw(e);
				}}
			/>
		);
	}

	componentDidMount(): void
	{
		this.updateSVG();
	}

	componentDidUpdate(): void
	{
		this.updateSVG();
	}

	updateSVG(): void
	{
		if (!this.svgRef.current) return;
		this.canvas ??= SVG(this.svgRef.current);

		this.canvas.clear();
		this.canvas.size(this.props.width, this.props.height);
		this.canvas.namespace();

		this.canvas.rect("100%", "100%").fill("#fff");

		for (const line of this.state.history[0] ?? [])
		{
			const points: ArrayXY[] = line.points.map(value => [value.x, value.y]);
			const svgLine: Polyline = this.canvas.polyline(points);
			svgLine.fill("none");
			svgLine.stroke({color: line.brushColor, width: line.brushRadius * 2, linecap: "round", linejoin: "round"});
		}
	}

	startDraw(event: React.MouseEvent | React.TouchEvent): void
	{
		if (!this.svgRef.current) return;

		this.lazyBrush.enable();
		this.lazyBrush.setRadius(this.props.strokeWidth / 2);

		const hexColor: string = this.getHexColor(this.props.strokeColor);
		const brushRadius: number = this.props.strokeWidth;

		const oldLines: CanvasLine[] = this.history[0] ?? [];
		this.history.unshift([...oldLines, {points: [], brushColor: hexColor, brushRadius: brushRadius}]);

		const canvas: Svg = SVG(this.svgRef.current);
		this.activeLine = canvas.polyline([]);
		this.activeLine.fill("none");
		this.activeLine.stroke({color: hexColor, width: brushRadius * 2, linecap: "round", linejoin: "round"});

		this.draw(event, true);
	}

	draw(event: React.MouseEvent | React.TouchEvent, force = false): void
	{
		if (!this.svgRef.current) return;

		const point: Point | undefined = this.getPos(event);
		if (point) this.lazyBrush.update(point);

		if (force || (this.lazyBrush.isEnabled() && this.lazyBrush.brushHasMoved()))
		{
			const point: Point = this.lazyBrush.getBrushCoordinates();
			const lines: CanvasLine[] = this.history[0];
			const curLine: CanvasLine = lines[lines.length - 1];

			if (!force && curLine.points.length > 0)
			{
				const lastPoint: Point = curLine.points[curLine.points.length - 1];

				const dx: number = point.x - lastPoint.x;
				const dy: number = point.y - lastPoint.y;
				if (Math.abs(dx) + Math.abs(dy) < 3) return;
			}

			lines[lines.length - 1].points.push(point);

			if (this.activeLine)
			{
				const points: ArrayXY[] = curLine.points.map(p => [p.x, p.y]);
				this.activeLine.plot(points);
			}
		}
	}

	endDraw(event: React.MouseEvent | React.TouchEvent): void
	{
		if (!this.lazyBrush.isEnabled()) return;

		this.draw(event, true);
		this.lazyBrush.disable();

		this.activeLine = undefined;
		this.updateHistory();
	}

	getPos(event: React.MouseEvent | React.TouchEvent): Point | undefined
	{
		if (!this.svgRef.current) return undefined;
		const rect: DOMRect = this.svgRef.current.getBoundingClientRect();

		let clientX: number | undefined = undefined;
		let clientY: number | undefined = undefined;

		if ("touches" in event)
		{
			clientX = event.touches[0].clientX;
			clientY = event.touches[0].clientY;
		}
		else
		{
			clientX = event.clientX;
			clientY = event.clientY;
		}

		if (!clientX || !clientY) return undefined;

		const point: Point = {
			x: (clientX - rect.left) * (this.props.width / rect.width),
			y: (clientY - rect.top) * (this.props.height / rect.height),
		};
		return point;
	}

	/**
	 * I love hacky workarounds.
	 */
	getHexColor(cssColor: CSSProperties["color"]): string
	{
		const div = document.createElement("div");
		div.style.color = cssColor as string;
		document.body.appendChild(div);
		const computed = getComputedStyle(div).color;
		document.body.removeChild(div);

		const [r, g, b] = computed.match(/\d+/g)?.map(Number) ?? [0, 0, 0];
		return "#" + [r, g, b].map(i => i.toString(16).padStart(2, "0")).join("");
	}

	updateHistory(): void
	{
		this.setState(() =>
		{
			if (this.history.length > 10) this.history.length = 10;
			return {history: this.history};
		});
	}
}

interface CanvasProps
{
	width: number;
	height: number;
	color: CSSProperties["color"];
	style?: CSSProperties;

	strokeColor: CSSProperties["color"];
	strokeWidth: number;
}

interface CanvasState
{
	history: CanvasLine[][];
}
interface CanvasLine
{
	points: Point[];
	brushColor: string;
	brushRadius: number;
}
