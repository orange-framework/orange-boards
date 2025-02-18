import {
  Editor,
  getSnapshot,
  inlineBase64AssetStore,
  Tldraw,
  TLOnMountHandler,
  TLStoreSnapshot,
} from "tldraw";
import { useFetcher, useParams } from "@orange-js/orange";
import type { RefObject } from "react";
import { useSync } from "@tldraw/sync";
import { useMaybeSession } from "~/routes/_authed";

import tldrawStyles from "tldraw/tldraw.css?inline";
import overrideStyles from "./tldraw-override.css?inline";

const baseUrl = import.meta.hot
  ? "http://localhost:5173"
  : "https://boards.orange-js.dev";

export function TlDrawCanvas({
  editorRef,
  readOnly = false,
  onMount,
}: {
  editorRef: RefObject<Editor | null>;
  readOnly?: boolean;
  onMount?: TLOnMountHandler;
}) {
  const { id, owner } = useParams<"id" | "owner">();
  const session = useMaybeSession();
  const store = useSync({
    uri: `${baseUrl}/board/${owner}/${id}`,
    assets: inlineBase64AssetStore,
    userInfo: session?.user
      ? {
          id: session.user.id,
          name: session.user.name,
        }
      : {
          id: "anonymous",
          name: "Anonymous",
        },
  });

  const handleMount: TLOnMountHandler = (editor) => {
    if (readOnly) {
      editor.updateInstanceState({ isReadonly: true });
    }

    editorRef.current = editor;
    onMount?.(editor);
  };

  return (
    <>
      <style>{tldrawStyles}</style>
      <style>{overrideStyles}</style>
      <Tldraw
        acceptedImageMimeTypes={[]}
        acceptedVideoMimeTypes={[]}
        onMount={handleMount}
        store={store}
        options={{ maxPages: 1, maxFilesAtOnce: 0 }}
        className="tldraw__editor shadow-lg"
      />
    </>
  );
}

export function SaveButton({
  editorRef,
}: {
  editorRef: RefObject<Editor | null>;
}) {
  const fetcher = useFetcher();
  const onSave = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const { document } = getSnapshot(editor.store);
    fetcher.submit(
      {
        document: document as { [key in keyof TLStoreSnapshot]: any },
      },
      {
        encType: "application/json",
        method: "PATCH",
      },
    );
  };

  return (
    <button
      onClick={onSave}
      className="ml-auto bg-black px-3 py-2 rounded-md text-white"
    >
      Save
    </button>
  );
}
