const mongoose = require("mongoose");

const ProjSchema = new mongoose.Schema({
	tweet: {
		type: String,
	},
    link: {
		type: String,
	},
	isChecked:{
		type:Boolean,
	},
	avatar: {
		type: String
	},
	cloudinary_id: {
		type: String
	}

});

const TheProjects = mongoose.model("theprojects", ProjSchema);


module.exports = TheProjects
