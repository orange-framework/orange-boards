import { Link } from "@orange-js/orange";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { useMaybeSession } from "~/routes/_authed";

export function Nav({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  const session = useMaybeSession();
  const classes = twMerge("flex items-center gap-2 md:gap-4 w-full", className);

  return (
    <div className={classes}>
      <Link
        to="/"
        className="text-xl md:text-2xl font-semibold  mr-auto md:mr-0"
      >
        🍊 <span className="hidden md:inline-block">Orange</span> Boards
      </Link>
      <h2 className="hidden md:inline-block italic text-sm text-gray-600 mr-auto">
        aka. github x tldraw
      </h2>
      {children}
      {session ? (
        <>
          <Link
            to={`/profile/${session.user.username}`}
            className="text-black font-semibold"
          >
            My Boards
          </Link>
          <Link to="/signout" className="text-black font-semibold">
            Sign out
          </Link>
          <a
            href={`https://github.com/${session.user.username}`}
            className="hidden md:inline-block"
          >
            <img
              src={session.user.image ?? ""}
              className="shadow-md w-10 aspect-square rounded-xl hidden md:inline-block"
            />
          </a>
        </>
      ) : (
        <Link
          to="/signin"
          role="button"
          className="bg-black px-3 py-2 rounded-md text-white"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
