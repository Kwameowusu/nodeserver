const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({

	filename: {
		type: String,
		Default: "file"
	},
	avatar: {
		type: String
	},
	cloudinary_id: {
		type: String
	},
	isChecked: {
		type: Boolean,
	}

});

const TheProfile = mongoose.model("theprofile", ProfileSchema);


module.exports = TheProfile;
