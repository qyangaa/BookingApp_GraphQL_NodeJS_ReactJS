const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId, // Event _id
      ref: "Event", // match model name defined in event.js
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
