// This is where the magic happens, this route has a Durable Object with
// a loader, action, and websocket handler for managing the collaborative
// board.
//
// Loader and action: manage the list of allowed editors for the board.
// Websocket handler: manipulate the board state and sync with all connected.

import * as z from "zod";
import { type Editor } from "tldraw";
import {
  DurableActionFunctionArgs,
  DurableLoaderFunctionArgs,
  IdentifierFunctionArgs,
  RouteDurableObject,
  useDurableObject,
  WebsocketConnectArgs,
} from "@orange-js/orange";
import { RoomSnapshot, TLSocketRoom } from "@tldraw/sync-core";
import { state } from "diffable-objects";
import { useRef } from "react";
import { auth } from "~/auth.server";
import { ClientOnly } from "~/components/client-only";
import { TlDrawCanvas } from "~/components/tldraw-canvas.client";
import { useMaybeSession } from "./_authed";
import { Nav } from "~/components/nav";
import { BoardControl } from "~/components/board-control";
import { board } from "~/db/schema";
import { db } from "~/db";

export type State = {
  document: RoomSnapshot | undefined;
  id: string;
  owner: string;
  allowedEditors: string[];
  lastScreenshot?: string;
};

export class Draw extends RouteDurableObject<Env> {
  #state: State = state(this.ctx, "state", {
    document: undefined,
    id: "",
    owner: "",
    allowedEditors: [],
  });
  #room: TLSocketRoom | undefined;

  async loader({ params }: DurableLoaderFunctionArgs) {
    this.#state.owner = params.owner as string;
    this.#state.id = params.id as string;

    return {
      allowedEditors: this.#state.allowedEditors.map((it) => it.toString()),
      owner: this.#state.owner.toString(),
      id: this.#state.id.toString(),
    };
  }

  async action({ params, request }: DurableActionFunctionArgs) {
    const owner = params.owner as string;
    const session = await auth(this.env).api.getSession({
      headers: request.headers,
    });

    if (session?.user?.username !== owner) {
      return new Response("Unauthorized", { status: 401 });
    }

    this.#state.owner = owner;
    this.#state.id = params.id as string;

    const dataSchema = z.object({
      invite: z.string(),
    });

    const form = await request.formData();
    const { invite } = dataSchema.parse(Object.fromEntries(form.entries()));

    if (this.#state.allowedEditors.includes(invite.toLowerCase())) {
      return;
    }

    this.#state.allowedEditors.push(invite.toLowerCase());
  }

  async webSocketConnect({
    params,
    client,
    server,
    request,
  }: WebsocketConnectArgs): Promise<Response> {
    const owner = params.owner as string;
    const id = params.id as string;
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId") as string;

    const session = await auth(this.env).api.getSession({
      headers: request.headers,
    });

    this.#state.owner = owner;
    this.#state.id = id;
    this.#room ??= new TLSocketRoom({
      initialSnapshot: this.#state.document,
      log: console,
      onDataChange: async () => {
        if (!session) return;
        this.#state.document = JSON.parse(
          JSON.stringify(this.#room!.getCurrentSnapshot()),
        );

        const now = new Date();
        await db(this.env)
          .insert(board)
          .values({
            id: id,
            creator: session.user.username,
            createdAt: now,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: board.id,
            set: { updatedAt: now },
          });

        if (this.#state.lastScreenshot) {
          const lastScreenshot = new Date(this.#state.lastScreenshot).getTime();
          const now = new Date().getTime();

          if (now - lastScreenshot < 1000 * 30) {
            return;
          }
        }

        this.#state.lastScreenshot = new Date().toISOString();

        await this.env.ScreenshotWorkflow.create({
          params: {
            owner,
            id,
          },
        });
      },
    });

    server.accept();
    client.serializeAttachment({ sessionId });

    const canEdit =
      session?.user?.username?.toLowerCase() ===
        this.#state.owner.toLowerCase() ||
      this.#state.allowedEditors.includes(
        session?.user?.username?.toLowerCase() ?? "",
      );

    this.#room.handleSocketConnect({
      sessionId,
      socket: server,
      isReadonly: session === null || !canEdit,
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  static id({ params }: IdentifierFunctionArgs) {
    const { id, owner } = params;
    return `${owner}.${id}`;
  }
}

export default function Home() {
  const {} = useDurableObject<Draw>();
  const editorRef = useRef<Editor | null>(null);
  const session = useMaybeSession();

  return (
    <main className="w-screen h-screen flex flex-col gap-6 p-8">
      <Nav>
        <BoardControl username={session?.user?.username} />
      </Nav>
      <ClientOnly fallback={<div className="w-full h-full shadow-lg" />}>
        <TlDrawCanvas readOnly={session === null} editorRef={editorRef} />
      </ClientOnly>
    </main>
  );
}
