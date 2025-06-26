const mongoose = require('mongoose');

// Define the schema for your OHLCV data
const ohlcvSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  openTime: { type: Date, required: true },
  closeTime: { type: Date, required: true },
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number, required: true },
  quoteVolume: { type: Number }, 
}, {
  timestamps: true, 
  collection: 'ohlcvCandles' 
});

ohlcvSchema.index({ symbol: 1, closeTime: 1 }, { unique: true });

module.exports = mongoose.models.OHLCVCandle || mongoose.model('OHLCVCandle', ohlcvSchema);