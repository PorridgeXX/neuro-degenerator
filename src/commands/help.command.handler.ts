import { Composer } from "grammy";

export const helpCommandHandler = new Composer();

const HELP_TEXT = `
<b>Нейродегенератор — новый взгляд на будущее</b>

список команд:
/slop — генерация демотиватора по сообщения в чате
/help — показать это сообщение

<i>Бот собирает ваши сообщения и медиа из чата!</i>
  `.trim();

helpCommandHandler.command(["help", "start"], async (ctx) => {
  await ctx.reply(HELP_TEXT, { parse_mode: "HTML" });
});
