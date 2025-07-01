const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "";

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully via Mongoose.");

    // --- Graceful shutdown handlers ---
    // It's better to manage mongoose disconnection here for cleaner shutdown
    process.once("SIGINT", async () => {
      console.log("\nSIGINT received. Stopping bot...");
      await bot.stop("SIGINT");
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log("MongoDB disconnected.");
      }
      process.exit(0);
    });

    process.once("SIGTERM", async () => {
      console.log("\nSIGTERM received. Stopping bot...");
      await bot.stop("SIGTERM");
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log("MongoDB disconnected.");
      }
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
})();
