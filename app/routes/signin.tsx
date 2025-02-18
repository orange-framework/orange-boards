import { LoaderFunctionArgs, redirect } from "@orange-js/orange";
import { auth } from "~/auth.server";

export async function loader({ env }: LoaderFunctionArgs) {
  const signinUrl = await auth(env).api.signInSocial({
    body: {
      provider: "github",
      callbackURL: "/",
    },
  });

  if (!signinUrl || !signinUrl.url) {
    throw new Error("Failed to sign in");
  }

  return redirect(signinUrl.url);
}
