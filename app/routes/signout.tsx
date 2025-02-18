import { LoaderFunctionArgs, redirect } from "@orange-js/orange";
import { auth } from "~/auth.server";

export async function loader({ env, request }: LoaderFunctionArgs) {
  await auth(env).api.signOut({ headers: request.headers });
  return redirect("/");
}
