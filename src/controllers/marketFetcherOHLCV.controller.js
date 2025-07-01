const ccxt = require('ccxt');
const ohlcvCandleModel = require('../models/ohlcvCandle.model');

// --- CCXT Exchange Configuration ---
const exchange = new ccxt.binance({
  rateLimit: 1200,
  enableRateLimit: true,
});

// --- Data Filtering Function ---
/**
 * Filters CCXT OHLCV array data into a structured object for MongoDB.
 * CCXT OHLCV format: [ timestamp, open, high, low, close, volume ]
 * @param {string} symbol The trading pair symbol (e.g., 'BTC/USDT').
 * @param {Array<number>} ohlcvArray An array representing a single OHLCV candle.
 * @returns {object} An object containing the structured OHLCV data.
 */
function formatOHLCVCandle(symbol, ohlcvArray) {
  if (!Array.isArray(ohlcvArray) || ohlcvArray.length < 6) {
    throw new Error("Invalid OHLCV array format.");
  }

  const [timestamp, open, high, low, close, volume] = ohlcvArray;

  const openTime = new Date(timestamp);
  const calculatedCloseTime = new Date(timestamp + 60 * 1000); // For 1-minute candle

  return {
    symbol: symbol,
    openTime: openTime,
    closeTime: calculatedCloseTime,
    open: open,
    high: high,
    low: low,
    close: close,
    volume: volume,
    quoteVolume: close * volume, // Assuming quoteVolume is close * volume
  };
}

// --- Mongoose Storage Function ---
/**
 * Stores a single OHLCV candle document using Mongoose.
 * Uses findOneAndUpdate with upsert: true to prevent duplicates and update if exists.
 * @param {object} ohlcvData The formatted OHLCV data to insert/update.
 */
async function storeOHLCVCandle(ohlcvData) {
  try {
    await ohlcvCandleModel.findOneAndUpdate(
      { symbol: ohlcvData.symbol, closeTime: ohlcvData.closeTime },
      { $set: ohlcvData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`[${ohlcvData.closeTime.toISOString()}] ${ohlcvData.symbol}: Candle upserted successfully.`);

  } catch (error) {
    if (error.code === 11000) {
      console.warn(`[${ohlcvData.closeTime.toISOString()}] ${ohlcvData.symbol}: Duplicate candle detected (already processed).`);
    } else {
      console.error('Error storing data to MongoDB:', error);
    }
  }
}

// --- Main Bot Logic ---
const SYMBOL = 'BTC/USDT';
const TIMEFRAME = '1m';
const INTERVAL_MS = 60 * 1000; // Fetch every 60 seconds for 1-minute candles

async function fetchAndStoreOHLCV() {
  // console.log(`Fetching ${SYMBOL} ${TIMEFRAME} OHLCV at ${new Date().toISOString()}`);
  try {
    const ohlcvs = await exchange.fetchOHLCV(SYMBOL, TIMEFRAME, undefined, 1);

    if (ohlcvs && ohlcvs.length > 0) {
      const lastOhlcvArray = ohlcvs[0];
      const formattedCandle = formatOHLCVCandle(SYMBOL, lastOhlcvArray);
      await storeOHLCVCandle(formattedCandle);
    } else {
      console.log(`No ${TIMEFRAME} OHLCV data returned for ${SYMBOL}.`);
    }
  } catch (e) {
    console.error(`Error fetching or storing data: ${e.message}`);
  }
}

// Start the continuous data fetching process
async function startDataCollector() {
  // IMPORTANT: This module assumes Mongoose is ALREADY connected
  // by the time `startDataCollector()` is called from your main app.

  await fetchAndStoreOHLCV();

  setInterval(async () => {
    try {
      await fetchAndStoreOHLCV();
    } catch (e) {
      console.error(`Error in scheduled fetch: ${e.message}`);
    }

    console.log(`Starting data collection for ${SYMBOL} ${TIMEFRAME} every ${INTERVAL_MS / 1000} seconds...`);
  }, INTERVAL_MS);
}

module.exports = {
  startDataCollector
};