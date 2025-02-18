// This file acts as a layout for all routes that require authentication
// by providing a loader that validating the session against the database.

import { LoaderFunctionArgs, Outlet, useMatches } from "@orange-js/orange";
import { auth } from "~/auth.server";

export async function loader({ request, env }: LoaderFunctionArgs) {
  const maybeSession = await auth(env).api.getSession({
    headers: request.headers,
  });
  return maybeSession;
}

type LoadedSession = Awaited<ReturnType<typeof loader>>;

/**
 * @returns the session if it exists, otherwise null.
 */
export function useMaybeSession() {
  const matches = useMatches();
  const match = matches.find((match) => match.id === "routes/_authed");
  return (match?.data as LoadedSession) ?? null;
}

export function useSession(): Exclude<LoadedSession, null> {
  const session = useMaybeSession();
  if (!session) {
    throw new Error("Session not found");
  }
  return session;
}

export default function Layout() {
  return <Outlet />;
}
