import Route from "@/Route";
import AdminRoute from "./AdminRoute";
import EmbedRoute from "./EmbedRoute";
import GimmickRoute from "./GimmickRoute";
import TimezoneRoute from "./TimezoneRoute";

const ROUTES: typeof Route[] = [EmbedRoute, GimmickRoute, TimezoneRoute, AdminRoute];
export default ROUTES;
