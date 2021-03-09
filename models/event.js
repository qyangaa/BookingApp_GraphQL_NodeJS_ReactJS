const mongoose = require("mongoose");

const Schema = mongoose.Schema; //a constructor function

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId, //user _id
    ref: "User",
  },
});

//(Name_of_Model <String>, Schema), creates an constructor names Name_of_Model
module.exports = mongoose.model("Event", eventSchema);
