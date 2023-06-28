const mongoose = require("mongoose");
const user = require("./user");
const placSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photos: {
    type: [[String]],
    required: true,
  },
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
});

module.exports = mongoose.model("place", placSchema);
