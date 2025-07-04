require("dotenv").config();
require("./src/middlewares/dbConnection");
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");

const { mongoose } = require("./src/middlewares/dbConnection");

const {
  startDataCollector,
} = require("./src/controllers/marketFetcherOHLCV.controller");

const startCommand = require("./src/controllers/startCommand.controller");
const getCommandList = require("./src/helpers/getCommandList");
const addBalanceController = require("./src/controllers/addBalance.controller");

const bot = new Telegraf(process.env.BOT_TOKEN);

// --- Main Application Initialization ---
async function initializeApp() {
  try {
    await startDataCollector(); // Use await if startDataCollector has an initial async task

    console.log("Registering Telegraf bot handlers...");
    bot.start(startCommand);
    bot.command("addBalance", addBalanceController);
    bot.command("help", async (ctx) => {
      await ctx.reply(getCommandList(), { parse_mode: "Markdown" });
    });
    bot.on(message("text"), async (ctx) => {
      await ctx.replyWithMarkdownV2(`Hello, *${ctx.message.from.id}\\!*`);
    });

    console.log("Launching Telegraf bot...");
    bot.launch();
    console.log("Bot is running and data collection is active.");
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
}



process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

initializeApp();
