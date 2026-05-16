import { Composer } from "grammy";
import { createDemotivatorController } from "@/controllers";
export const slopCommandHandler = new Composer();

slopCommandHandler.command("slop", async (ctx) => {
  await createDemotivatorController(ctx);
});
