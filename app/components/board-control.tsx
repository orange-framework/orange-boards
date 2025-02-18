import { Form, useDurableObject } from "@orange-js/orange";
import { useState } from "react";
import type { Draw } from "~/routes/_authed.board.$owner.$id";

/**
 * Manages inviting collaborators to the board.
 */
export function BoardControl({ username }: { username: string | undefined }) {
  // Get the owner and allowed editors from the Draw durable object's loader.
  const { allowedEditors, owner } = useDurableObject<Draw>();
  const [isEditing, setIsEditing] = useState(false);

  if (username !== owner) return null;

  return (
    <>
      <button className="font-semibold" onClick={() => setIsEditing(true)}>
        Invite
      </button>
      <dialog
        className="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen z-[1000] bg-black bg-opacity-50"
        onClick={() => setIsEditing(false)}
        open={isEditing}
      >
        <div className="flex flex-col items-center justify-center w-full h-full bg-transparent">
          <Form
            method="patch"
            className="flex flex-col gap-2 bg-white shadow-lg rounded-md p-4 max-w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold">Add collaborators</h2>
            <input
              className="p-2 rounded text-sm"
              type="text"
              placeholder="Username"
              name="invite"
            />
            <button className="p-2 rounded bg-orange-500 text-black text-sm font-semibold">
              Invite
            </button>
            {allowedEditors.length > 0 && (
              <div className="flex flex-row gap-2 flex-wrap max-w-full">
                {allowedEditors.map((editor) => (
                  <img
                    src={`https://github.com/${editor}.png`}
                    className="w-8 aspect-square rounded-md"
                  />
                ))}
              </div>
            )}
          </Form>
        </div>
      </dialog>
    </>
  );
}
