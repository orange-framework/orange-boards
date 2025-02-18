import { ComponentProps, PropsWithChildren } from "react";
import { Link } from "@orange-js/orange";
import { twMerge } from "tailwind-merge";

export function GlowButton({
  children,
  slim,
  ...props
}: PropsWithChildren<ComponentProps<"button"> & { slim?: boolean }>) {
  const classes = twMerge(
    "group-hover:-translate-y-1 relative inline-flex items-center justify-center py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900",
    slim ? "px-4" : "px-8",
  );

  return (
    <div className="relative inline-flex group mt-16">
      <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 group-hover:-translate-y-1 animate-tilt"></div>
      <button className={classes} {...props}>
        {children}
      </button>
    </div>
  );
}

export function GlowLinkButton({
  children,
  slim,
  ...props
}: PropsWithChildren<ComponentProps<typeof Link> & { slim?: boolean }>) {
  const classes = twMerge(
    "group-hover:-translate-y-1 relative inline-flex items-center justify-center py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900",
    slim ? "px-4" : "px-8",
  );

  return (
    <div className="relative inline-flex group mt-16">
      <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 group-hover:-translate-y-1 animate-tilt"></div>
      <Link className={classes} role="button" {...props}>
        {children}
      </Link>
    </div>
  );
}
