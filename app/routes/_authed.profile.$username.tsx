import { LoaderFunctionArgs, useLoaderData } from "@orange-js/orange";
import { eq } from "drizzle-orm";
import { RenderedBoard } from "~/components/rendered-board";
import { db } from "~/db";
import { board } from "~/db/schema";
import { Nav } from "~/components/nav";

export async function loader({ params, env }: LoaderFunctionArgs) {
  const username = params.username as string;
  const boards = await db(env).query.board.findMany({
    where: eq(board.creator, username),
  });

  return {
    username,
    boards,
  };
}

export default function Profile() {
  const { username, boards } = useLoaderData<typeof loader>();

  return (
    <main className="w-screen h-screen p-8 flex flex-col gap-10">
      <Nav />
      <section className="flex flex-col items-center gap-4">
        <div className="shadow-2xl bg-white rounded-xl">
          <img
            src={`https://github.com/${username}.png`}
            className=" w-48 aspect-square rounded-xl"
          />
        </div>
        <a
          href={`https://github.com/${username}`}
          className="text-4xl font-semibold text-gray-700 mt-4"
        >
          @{username}
        </a>
      </section>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-12 w-full justify-items-center">
        {boards.map((board) => (
          <RenderedBoard key={board.id} id={board.id} owner={username} />
        ))}
      </section>
    </main>
  );
}
