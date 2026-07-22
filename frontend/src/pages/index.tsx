import AdminRoute from "../admin";
import AboutMePage from "./AboutMePage";
import MainPage from "./MainPage";
import type Page from "./Page";
import ProjectsPage from "./ProjectsPage";
import SocialsPage from "./SocialsPage";

export const PAGES: (typeof Page)[] = [MainPage, AboutMePage, ProjectsPage, SocialsPage, AdminRoute];
