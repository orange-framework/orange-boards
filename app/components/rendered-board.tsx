import { Link } from "@orange-js/orange";
import { twMerge } from "tailwind-merge";

export function RenderedBoard({
  id,
  owner,
  noHover = false,
}: {
  id: string;
  owner: string;
  noHover?: boolean;
}) {
  const classes = twMerge(
    "rounded-xl bg-white w-[300px] md:w-[400px] aspect-video object-cover shadow-lg transition-all",
    !noHover && "hover:shadow-xl hover:-translate-y-1",
  );
  return (
    <Link to={`/board/${owner}/${id}`}>
      <img src={`/board/${owner}/${id}/content`} className={classes} />
    </Link>
  );
}
