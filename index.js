require("dotenv").config();
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const startCommand = require("./src/controllers/start.command");
const getCommandList = require("./src/helpers/getCommandList");
require("./src/middlewares/dbConnection"); // 🔌 Ensure database connection is established

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🚀 Handle /start command
bot.start(startCommand);

// 📖 Handle /help command
bot.command("help", async (ctx) => {
  await ctx.reply(getCommandList(), { parse_mode: "Markdown" });
});

// 💬 Handle random text messages
bot.on(message("text"), async (ctx) => {
  // Example: Echo with markdown
  await ctx.replyWithMarkdownV2(`Hello, *${ctx.message.from.id}\\!*`);
});

// ⛔ Graceful shutdown handlers
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// 🚀 Start the bot
bot.launch();
console.log("Bot is running...");

// ---
// 📝 OPTIONAL: Uncomment and expand later if needed

// bot.command("quit", async (ctx) => {
//   await ctx.leaveChat(); // Leave the chat
// });

// bot.on("callback_query", async (ctx) => {
//   await ctx.answerCbQuery(); // For inline buttons
// });

// bot.on("inline_query", async (ctx) => {
//   const result = []; // Fill with dynamic search results
//   await ctx.answerInlineQuery(result);
// });
