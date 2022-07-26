const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema({
	about: {
		type: String,
	},
	isChecked:{
		type:Boolean,
	}
	

});

const TheAbout = mongoose.model("theabout", AboutSchema);


module.exports = TheAbout
