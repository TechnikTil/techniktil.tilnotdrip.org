import Route from "@/Route";
import AdminRoute from "./AdminRoute";
import DataRoute from "./DataRoute";
import EmbedRoute from "./EmbedRoute";
import GimmickRoute from "./GimmickRoute";

const ROUTES: Route[] = [new EmbedRoute(), new GimmickRoute(), new DataRoute(), new AdminRoute()];
export default ROUTES;
