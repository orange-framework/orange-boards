import { auth } from "~/auth.server";

export default {
  async fetch(request: Request, env: Env) {
    return await auth(env).handler(request);
  }
}