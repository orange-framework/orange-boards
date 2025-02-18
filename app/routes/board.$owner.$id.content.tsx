import { LoaderFunctionArgs, redirect } from "@orange-js/orange";

// Proxies images from an R2 bucket.
export async function loader({ env, params }: LoaderFunctionArgs) {
  const id = params.id as string;
  const item = await env.images.get(`${id}.png`);
  if (!item) {
    return redirect(
      "https://boards.orange-js.dev/board/zebp/0303f17d-510d-4d99-875e-ee964d143b96/content",
    );
  }

  return new Response(item.body, {
    headers: {
      "Content-Type": "image/png",
      "cache-control": "public, max-age=600",
    },
  });
}
