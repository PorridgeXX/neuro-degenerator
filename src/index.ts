import { bot } from "@/app";
import { logger } from "@/utils";
import { run } from "@grammyjs/runner";

async function init() {
  try {
    run(bot);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error({ err: error }, "Init error");
    } else {
      logger.error(`Unknown error: ${error}`);
    }
    process.exit(1);
  }
}

await init();
