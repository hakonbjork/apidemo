const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  author: { type: String },
  title: { type: String },
  created: { type: String },
  id: { type: String },
});

module.exports = mongoose.model("book", bookSchema);