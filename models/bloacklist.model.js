const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
  blacklisted: { type: String, required: true },
});

const BlacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = { BlacklistModel };
