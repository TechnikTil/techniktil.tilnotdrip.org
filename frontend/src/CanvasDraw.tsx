import { type ArrayXY, Polyline, SVG, type Svg } from "@svgdotjs/svg.js";
import { LazyBrush, type Point } from "lazy-brush";
import type { CSSProperties, JSX, Ref, RefObject } from "react";
import { createRef, useEffect, useImperativeHandle, useRef } from "react";
import simplify from "simplify-js";

export default function CanvasDraw(props: CanvasProps): JSX.Element
{
	const canvas: RefObject<Svg | null> = createRef<Svg>();
	const isPressing: RefObject<boolean> = useRef<boolean>(false);

	const point: RefObject<DOMPoint> = useRef<DOMPoint>(new DOMPoint(props.width / 2, props.height / 2));
	const lazy: RefObject<LazyBrush> = useRef<LazyBrush>(
		new LazyBrush({enabled: true, radius: props.strokeRadius, initialPoint: point.current}),
	);

	const line: RefObject<Polyline | null> = createRef<Polyline>();
	const history: RefObject<HistoryAction[]> = useRef<HistoryAction[]>([]);

	let raf: number | undefined = undefined;
	function updateLazyBrush(): void
	{
		const hasMoved: boolean = lazy.current.update(point.current);

		function addPoint(): void
		{
			if (!line.current) return;

			const point: Point = lazy.current.getBrushCoordinates();

			const plotPoints: ArrayXY[] = line.current.array().valueOf();
			if (plotPoints.length < 1) plotPoints.push([point.x, point.y]);
			plotPoints.push([point.x, point.y]);

			line.current.plot(plotPoints);
		}

		if (isPressing.current && !line.current)
		{
			line.current = canvas.current?.polyline([]) ?? null;
			line.current?.fill("none");
			line.current?.stroke({
				color: props.strokeColor,
				width: props.strokeRadius * 2,
				linecap: "round",
				linejoin: "round",
			});

			addPoint();
		}

		if (line.current && hasMoved) addPoint();

		raf = requestAnimationFrame(updateLazyBrush);
	}

	function handlePointerMove(newX: number, newY: number): void
	{
		point.current.x = newX;
		point.current.y = newY;

		const ctm: DOMMatrix | undefined = canvas.current?.node.getScreenCTM()?.inverse();
		point.current = point.current.matrixTransform(ctm);
	}

	function onPointerDown(event: PointerEvent): void
	{
		if (event.pointerType == "touch")
		{
			handlePointerMove(event.clientX, event.clientY);
			lazy.current.update(point.current, {both: true});
		}

		isPressing.current = true;
	}

	function onPointerMove(event: PointerEvent): void
	{
		if (event.buttons == 1)
		{
			isPressing.current = true;
		}

		handlePointerMove(event.clientX, event.clientY);
	}

	function onPointerUp(event: PointerEvent): void
	{
		isPressing.current = false;

		if (line.current)
		{
			simplifyPolyline(line.current, 0.3, true);

			history.current.push({type: "STROKE", element: line.current});
			if (history.current.length > 10) history.current.length = 10;

			line.current = null;
		}

		if (event.pointerType == "touch")
		{
			const brush: Point = lazy.current.getBrushCoordinates();
			lazy.current.update(brush, {both: true});
		}
	}

	function onPointerLeave(event: PointerEvent): void
	{
		handlePointerMove(event.clientX, event.clientY);
		lazy.current.update(point.current, {both: true});

		onPointerUp(event);
	}

	useImperativeHandle(props.ref, () => ({
		getSVG: () =>
		{
			return canvas.current?.svg() ?? "";
		},
		undo: () =>
		{
			if (!canvas.current) return;

			const action: HistoryAction | undefined = history.current.pop();
			if (!action) return;

			switch (action.type)
			{
				case "CLEAR":
					action.elements.forEach(line => canvas.current?.add(line));
					break;

				case "STROKE":
					action.element.remove();
					break;
			}
		},
		clear: (clearHistory?: boolean) =>
		{
			if (!canvas.current) return;

			const lines: Polyline[] = [];
			canvas.current.children().forEach(line =>
			{
				if (line instanceof Polyline)
				{
					line.remove();
					lines.push(line);
				}
			});
			history.current.push({type: "CLEAR", elements: lines});
			if (history.current.length > 10) history.current.length = 10;

			if (clearHistory) history.current.length = 0;
		},
	}));

	useEffect(() =>
	{
		updateLazyBrush();

		if (canvas.current)
		{
			canvas.current.pointerdown(onPointerDown);
			canvas.current.pointermove(onPointerMove);
			canvas.current.pointerup(onPointerUp);
			canvas.current.pointerleave(onPointerLeave);
			canvas.current.pointercancel(onPointerLeave);
		}

		return () =>
		{
			if (raf !== undefined) cancelAnimationFrame(raf);
		};
	});

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			style={{...props.style, touchAction: "none"}}
			viewBox={`0 0 ${String(props.width)} ${String(props.height)}`}
			width={props.width}
			height={props.height}
			ref={(svg: SVGSVGElement) =>
			{
				canvas.current = SVG(svg);
			}}
		>
			<rect width="100%" height="100%" fill={props.bgColor} />
		</svg>
	);
}

CanvasDraw.defaultProps = {
	width: 400,
	height: 400,
	bgColor: "#ffffff",
	strokeColor: "#000000",
	strokeWidth: 4,
	style: {},
};

// god bless simplifying algorithms
function simplifyPolyline(polyline: Polyline, tolerance: number, highQuality: boolean): void
{
	const points: Point[] = polyline.array().valueOf().map(v =>
	{
		return {x: v[0], y: v[1]};
	});

	let simplifiedPoints: Point[] = simplify(points, tolerance, highQuality);
	if (simplifiedPoints.length == 1) simplifiedPoints = [simplifiedPoints[0], simplifiedPoints[0]];

	polyline.plot(simplifiedPoints.map(v => [v.x, v.y] as ArrayXY));
}

export interface CanvasDrawHandle
{
	getSVG: () => string;
	undo: () => void;
	clear: (clearHistory?: boolean) => void;
}

interface CanvasProps
{
	width: number;
	height: number;
	bgColor: string;

	strokeColor: CSSProperties["color"];
	strokeRadius: number;

	style?: CSSProperties;
	ref: Ref<CanvasDrawHandle>;
}

type HistoryAction = {type: "STROKE"; element: Polyline;} | {type: "CLEAR"; elements: Polyline[];};
