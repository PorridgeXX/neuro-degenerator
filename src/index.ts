import { bot } from "./app";
import { logger } from "./utils";

async function init() {
  try {
    await bot.start();
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`❌ Ошибка инициализации: ${error.message}`);
    } else {
      logger.error(`❌ Неизвестная ошибка: ${String(error)}`);
    }
    process.exit(1);
  }
}

await init();
