import {
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { board } from "./db/schema";
import { screenshot } from "./screenshot.server";

type ScreenshotParams = {
  owner: string;
  id: string;
};

export class ScreenshotWorkflow extends WorkflowEntrypoint<
  Env,
  ScreenshotParams
> {
  async run(
    event: Readonly<WorkflowEvent<ScreenshotParams>>,
    step: WorkflowStep,
  ): Promise<void> {
    await step.sleep("wait for edits", "30 seconds");
    await step.do("take screenshot", async () => {
      const row = await db(this.env).query.board.findFirst({
        where: eq(board.id, event.payload.id),
      });

      if (!row) {
        throw new Error("Board not found");
      }

      await screenshot(this.env, event.payload.owner, event.payload.id);
    });
  }
}
