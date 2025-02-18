import * as uuid from "uuid";
import { GlowLinkButton } from "~/components/fancy-button";
import { useMaybeSession } from "./_authed";
import { Link, LoaderFunctionArgs, useLoaderData } from "@orange-js/orange";
import { db } from "~/db";
import { RenderedBoard } from "~/components/rendered-board";
import { board, Board } from "~/db/schema";
import { desc } from "drizzle-orm";
import { Nav } from "~/components/nav";

export async function loader({ env }: LoaderFunctionArgs) {
  const boards = await db(env).query.board.findMany({
    limit: 30,
    orderBy: [desc(board.updatedAt)],
  });

  return {
    board: uuid.v4(),
    boards,
  };
}

function BoardCard({ id, creator, createdAt }: Board) {
  return (
    <div className="rounded-xl bg-gray-100 flex flex-col w-[300px] md:w-[400px]">
      <header className="flex flex-row font-semibold items-center p-2 gap-3">
        <img
          src={`https://github.com/${creator}.png`}
          className="w-8 aspect-square rounded-md"
        />
        <Link to={`/profile/${creator}`}>@{creator}</Link>

        <span className="ml-auto italic text-gray-600 text-xs">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </header>
      <RenderedBoard noHover owner={creator} id={id} />
    </div>
  );
}

function UsedChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-orange-500 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
      {children}
    </span>
  );
}

export default function Home() {
  const maybeSession = useMaybeSession();
  const { board, boards } = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-col items-center">
      <Nav className="px-8 p-8" />
      <section className="h-[75vh] flex flex-col justify-center items-center gap-4">
        <h1 className="text-3xl md:text-7xl font-semibold relative">
          🍊 Orange Boards
          <h3 className="absolute text-sm -right-14 -rotate-[15deg] hidden md:inline text-gray-700 -bottom-3 font-medium">
            an 🍊{" "}
            <a
              href="https://orange-js.dev/"
              className="text-orange-500 underline font-semibold"
            >
              Orange JS
            </a>{" "}
            demo
          </h3>
        </h1>
        <h2 className="text-xl md:text-3xl text-gray-600 italic">
          github x tldraw
        </h2>

        {maybeSession ? (
          <GlowLinkButton to={`/board/${maybeSession.user.username}/${board}`}>
            Let's Draw
          </GlowLinkButton>
        ) : (
          <GlowLinkButton to="/signin">Sign in</GlowLinkButton>
        )}
      </section>

      <section className="rounded-lg bg-black w-screen px-10 py-10 flex flex-col items-center gap-16">
        <h1 className="text-5xl font-semibold text-white">Recent Boards</h1>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-12 w-full justify-items-center">
          {boards.map((board) => (
            <BoardCard key={board.id} {...board} />
          ))}
        </div>
      </section>

      <footer className="flex flex-col gap-4 text-gray-600 p-20 w-screen h-[20vh]">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl">
            Built with 🧡 using{" "}
            <a href="https://orange-js.dev/" className="font-semibold">
              🍊 Orange
            </a>
          </h1>
          <h2 className="text-xl">
            <a
              href="https://github.com/orange-framework/orange-boards"
              className="text-blue-500 underline underline-offset-4"
            >
              Source
            </a>
          </h2>
        </div>
        <div className="flex flex-row flex-wrap text-sm text gap-2 items-center">
          Made using:{" "}
          {used.map((u) => (
            <UsedChip key={u}>{u}</UsedChip>
          ))}
        </div>
      </footer>
    </main>
  );
}

const used = [
  "TlDraw",
  "Orange",
  "Durable Objects",
  "D1",
  "R2",
  "Tailwind",
  "Drizzle",
];
