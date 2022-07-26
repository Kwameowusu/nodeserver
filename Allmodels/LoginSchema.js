const mongoose = require("mongoose");

const LoginFormSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	// 	unique: true,
	},

	email: {
		type: String,
		required: true,
	// 	unique: true,
	},
	password: {
		type: String,
		required: true,
	// 	unique: true,
	},
	avatar: {
		type: String
	},
	cloudinary_id: {
		type: String
	},
	name: {
			type: String,
		},
	userType: {
		type: String,
		required: true,
		default: 'Admin'
	},
	isChecked: {
		type: Boolean,
		default: false,
	},
	isOpen: {
		type: Boolean,
		default: false,
	},
});

const TheLoginForm = mongoose.model("theloginform", LoginFormSchema);


module.exports = TheLoginForm;
