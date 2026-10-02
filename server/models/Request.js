const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rawText: { type: String, required: true }, // original sentence typed by user
    bloodType: { type: String, required: true },
    city: { type: String, required: true },
    urgency: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["open", "fulfilled"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
