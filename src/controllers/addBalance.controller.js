module.exports = addBalance = async (ctx) => {
  //   const { id } = ctx.from;

  try {
    // launch webapp to add balance
    await ctx.reply(`Continue in the web app to add balance. 💸`, {
      // reply_markup: {
      //   web_app: {
      //     url: `https://minghq.vercel.app`,
      //     // url: `https://minghq.vercel.app/add-balance?amount=${amount}&userId=${id}`,
      //   },
      // },
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Continue",
              //   web_app: { url: process.env.APP_URL },
              web_app: { url: `http://localhost:3000/?tgId=${ctx.from.id}` },
            },
          ],
        ],
      },
    });
  } catch (err) {
    console.error("Error launching web app for balance addition:", err);
    await ctx.reply("Something went sideways 😵‍💫");
  }
};
