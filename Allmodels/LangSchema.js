const mongoose = require("mongoose");

const LangSchema = new mongoose.Schema({
	link: {
		type: String,
		// required: true,
		// 	unique: true,
	},

	name: {
		type: String,
		// required: true,
		// 	unique: true,
	},
	skills: {
		type: String,
		// required: true,
		// 	unique: true,
	},
	isChecked: {
		type: Boolean,
	},


	thefiles: {
		firstfile: {
			avatar: {
				type: String
			},
			cloudinary_id: {
				type: String
			}
		},
		secondfile: {
			avatar: {
				type: String
			},
			cloudinary_id: {
				type: String
			}
		},
	},

});

const TheLang = mongoose.model("thelang", LangSchema);


module.exports = TheLang
