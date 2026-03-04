import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter } from "react-router-dom";
import NavigationBar from "./NavigationBar.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<NavigationBar />
		</BrowserRouter>
	</StrictMode>,
);
