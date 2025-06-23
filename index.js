const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// bot.command('quit', async (ctx) => {
//   // Explicit usage
//   await ctx.telegram.leaveChat(ctx.message.chat.id)

//   // Using context shortcut
//   await ctx.leaveChat()
// })

bot.on(message("text"), async (ctx) => {
  // Explicit usage
  // await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello User}`)

  // Using context shortcut
  await ctx.replyWithMarkdownV2(`Hello, *${ctx.message.from.id}\\!*`);
});

// bot.on('callback_query', async (ctx) => {
//   // Explicit usage
//   await ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

//   // Using context shortcut
//   await ctx.answerCbQuery()
// })

// bot.on('inline_query', async (ctx) => {
//   const result = []
//   // Explicit usage
//   await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

//   // Using context shortcut
//   await ctx.answerInlineQuery(result)
// })

bot
  .launch()
  .then(() => {
    console.log("Bot is up and running");
  })
  .catch((err) => {
    console.error("Failed to launch bot:", err);
  });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
