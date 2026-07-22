import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css";
import { BrowserRouter } from "react-router-dom";
import * as GlobalNodes from "./GlobalNodes";
import NavigationBar from "./NavigationBar";

export const DEFAULT_TITLE = "TechnikTil's Website";

function main(): void
{
  const rootElement: HTMLElement | null = document.getElementById("root");
  if (!rootElement)
  {
    const e: Error = new Error("Root element could not be found!");
    throw e;
  }

  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <GlobalNodes.WebsiteLogoText />
        <NavigationBar />
        <GlobalNodes.Pages />
        <GlobalNodes.WipDisclaimer />
      </BrowserRouter>
    </StrictMode>
  );
}

main();
