// This route is meant only to be used by the browser-rendering feature to take
// a screenshot of a board for the preview on the home page or profile page.

import { useRef } from "react";
import {
  ActionFunctionArgs,
  useFetcher,
  type FetcherWithComponents,
} from "@orange-js/orange";
import { Editor } from "tldraw";
import { ClientOnly } from "~/components/client-only";
import { TlDrawCanvas } from "~/components/tldraw-canvas.client";

export async function action({ request, env, params }: ActionFunctionArgs) {
  const userAgent = request.headers.get("User-Agent");
  if (userAgent !== env.BROWSER_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = params.id as string;
  const form = await request.formData();
  const screenshot = form.get("file");

  if (!(screenshot instanceof Blob)) {
    return new Response("Invalid file", { status: 400 });
  }

  // Save the screenshot to the images bucket
  await env.images.put(`${id}.png`, screenshot);
  return new Response("OK", { status: 201 });
}

export default function InternalScreenshot() {
  const editorRef = useRef<Editor | null>(null);
  const fetcher = useFetcher<typeof action>();

  return (
    <ClientOnly>
      <TlDrawCanvas
        readOnly
        editorRef={editorRef}
        onMount={(editor) => takeScreenshot(editor, fetcher)}
      />
    </ClientOnly>
  );
}

function takeScreenshot(
  editor: Editor,
  fetcher: FetcherWithComponents<unknown>,
) {
  const shapeIds = editor.getCurrentPageShapeIds();
  editor.zoomToFit({
    immediate: true,
    force: true,
  });
  editor
    .toImage([...shapeIds], {
      format: "png",
      background: false,
      scale: 0.5,
      padding: 40,
    })
    .then(({ blob }) => {
      const form = new FormData();
      form.append("file", blob, "screenshot.png");

      fetcher.submit(form, {
        encType: "multipart/form-data",
        method: "POST",
      });
    });
}
