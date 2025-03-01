import { app } from "@orange-js/orange/server";
import * as serverBuild from "virtual:orange/server-bundle";

export * from "virtual:orange/entrypoints";
export * from "./workflows.server";

export default app(serverBuild);
