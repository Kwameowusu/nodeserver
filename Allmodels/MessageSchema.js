const mongoose = require("mongoose");

const userFormSchema = new mongoose.Schema({
	email: {
		type: String,
	},

	message: {
		type: String,
	},
	date: {
		type: String,
	},
	isChecked: {
		type: Boolean,
		default: false,
	},
});

const TheMessageForm = mongoose.model("themessageform", userFormSchema);

module.exports = TheMessageForm;


/** date: {
    type: Date,
    default: Date.now
  } */