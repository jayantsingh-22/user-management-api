const mongoose = require("mongoose");

const customPropertySchema = new mongoose.Schema({
  title: String,
  fallbackValue: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  customProperties: { type: Map, of: String },
});

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $exists: true, $ne: null } },
  }
);

const listSchema = new mongoose.Schema({
  title: String,
  customProperties: [customPropertySchema],
  users: { type: [userSchema], default: [] },
  unsubscribedEmails: { type: [String], default: [] },
});

const List = mongoose.model("List", listSchema);

module.exports = { List };
