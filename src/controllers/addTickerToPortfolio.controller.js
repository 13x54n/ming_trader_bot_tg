// Description: Controller to add a ticker to existing user's portfolio using tg commands
module.exports = addTickerToPortfolio = async (ctx) => {
  const { id, username, first_name, last_name } = ctx.from;
  const ticker = ctx.message.text.split(" ")[1]?.toUpperCase();

  if (!ticker) {
    return ctx.reply(
      "Please provide a ticker symbol to add to your portfolio."
    );
  }

  try {
    // check balance too
    let user = await UserModel.findOne({ telegramId: id });
    if (!user) {
      ctx.reply(`You haven't created a portfolio yet. Please create one first.`, {
        parse_mode: "Markdown",
      });
    } else {
      // 🙌 Existing user, update their portfolio
      if (user.portfolio.includes(ticker)) {
        return ctx.reply(`Ticker ${ticker} is already in your portfolio.`);
      }
      user.portfolio.push(ticker);
      await user.save();
      await ctx.reply(`Ticker ${ticker} added to your portfolio!`, {
        parse_mode: "Markdown",
      });
    }
  } catch (err) {
    console.error("Error adding ticker to portfolio:", err);
    await ctx.reply("Something went sideways 😵‍💫");
  }
};
