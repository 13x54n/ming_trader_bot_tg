const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/trade4me";

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully via Mongoose.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
})();
