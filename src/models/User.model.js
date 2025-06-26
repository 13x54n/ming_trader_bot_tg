const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  username: String,
  firstName: String,
  lastName: String,
  portfolio: {
    type: [
      {
        ticker: { type: String, required: true },
        quantity: { type: Number, required: true, default: 0 },
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = UserModel = mongoose.models.User || mongoose.model("User", userSchema);
