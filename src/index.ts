import { bot } from "@/app";
import { logger } from "@/utils";

async function init() {
  try {
    await bot.start();
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
