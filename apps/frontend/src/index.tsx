import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import NavigationBar from "./NavigationBar.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<NavigationBar />
	</StrictMode>,
);
