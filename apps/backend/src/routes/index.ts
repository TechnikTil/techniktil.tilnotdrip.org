import Route from "@/Route";
import AdminRoute from "./AdminRoute";
import EmbedRoute from "./EmbedRoute";
import StrawRoute from "./StrawRoute";
import TimezoneRoute from "./TimezoneRoute";

const ROUTES: typeof Route[] = [EmbedRoute, StrawRoute, TimezoneRoute, AdminRoute];
export default ROUTES;
