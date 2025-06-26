const getCommandList = require("../helpers/getCommandList");
const UserModel = require("../models/User.model");

module.exports = startCommand = async (ctx) => {
  const { id, username, first_name, last_name } = ctx.from;

  try {
    let user = await UserModel.findOne({ telegramId: id });

    if (!user) {
      // 🧾 Create a new user if they don't exist
      user = await UserModel.create({
        telegramId: id,
        username,
        firstName: first_name,
        lastName: last_name,
      });

      await ctx.reply(getCommandList(first_name), { parse_mode: "Markdown" });
    } else {
      // 🙌 Returning user
      await ctx.reply(`Welcome back, ${first_name} 👋\n${getCommandList()}`, {
        parse_mode: "Markdown",
      });
    }
  } catch (err) {
    console.error("User check error:", err);
    await ctx.reply("Something went sideways 😵‍💫");
  }
};
