import { drizzle } from "drizzle-orm/d1";
import { lazy } from "~/util";
import * as schema from "./schema";

export const db = lazy((env: Env) => drizzle(env.USERS_DATABASE, { schema }));