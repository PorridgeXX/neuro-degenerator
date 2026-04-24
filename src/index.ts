import {bot} from "./app";


async function init(){
   try {
    await bot.start();
   }catch (error: unknown) {
       if (error instanceof Error) {
           console.error(`❌ Ошибка инициализации: ${error.message}`);
       } else {
           console.error(`❌ Неизвестная ошибка: ${String(error)}`);
       }
    process.exit(1);
   }
}

await init();