const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({


	avatar: {
		type: String
	},
	cloudinary_id: {
		type: String
	},
	isChecked:{
		type:Boolean,
	}
	

});

const TheBanner = mongoose.model("thebanner", BannerSchema);


module.exports = TheBanner;
