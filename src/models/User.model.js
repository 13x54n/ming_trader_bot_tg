// models/User.ts
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = UserModel = mongoose.models.User || mongoose.model("User", userSchema);
