const express = require("express");
const LangUploadsRouter = express.Router();
const AsyncHandler = require("express-async-handler");
const TheLang = require("../Allmodels/LangSchema");
const cloudinary = require("../utilFiles/cloudinary");
const upload = require("../utilFiles/multerFiles");





//Upload developers

LangUploadsRouter.post(
	"/post-lang",
	upload.fields([
		{
			name: "profile",
			maxCount: 1,
		},
		{
			name: "banner",
			maxCount: 1,
		},
	]),

	AsyncHandler(async (req, res) => {
		const name = req.body.name;
		const link = req.body.link;
		const skills = req.body.skills;
		const isChecked = false
		let result1 = await cloudinary.uploader.upload(req.files.profile[0].path);
		let result2 = await cloudinary.uploader.upload(req.files.banner[0].path);

		console.log(req.body);

		let firstfile = {
			avatar: result1.secure_url,
			cloudinary_id: result1.public_id,
		};

		let secondfile = {
			avatar: result2.secure_url,
			cloudinary_id: result2.public_id,
		};

		let thefiles = {
			firstfile,
			secondfile,
		};

		const postingdevs = new TheLang({
			link,
			name,
			isChecked,
			skills,
			thefiles,
		});

		await postingdevs.save();
		res.send({ message: " 👨🏿‍💻 You Featured new Developer" });
	})
);


LangUploadsRouter.get(
	"/all-langs",
	AsyncHandler(async (req, res) => {
		let PLU = await TheLang.find();
		res.send(PLU);
	})
);

LangUploadsRouter.delete(
	"/delete-dev/:_id",
	AsyncHandler(async (req, res, next) => {
		// console.log(req.params._id);
		let PLU = await TheLang.findByIdAndRemove(req.params._id);
		if(PLU.thefiles.firstfile.cloudinary_id ){
			await cloudinary.uploader.destroy(PLU.thefiles.firstfile.cloudinary_id);
		}

		if(PLU.thefiles.secondfile.cloudinary_id){
			await cloudinary.uploader.destroy(PLU.thefiles.secondfile.cloudinary_id);
		}
		res.send(PLU);
	})
);

LangUploadsRouter.delete(
	"/del-all-devs",
	AsyncHandler(async (req, res, next) => {
		// console.log(req.params._id);
		let IM = await TheLang.find();
        // console.log(IM)
       await IM.forEach(element => {
            console.log(element.cloudinary_id)
            if( element.thefiles.secondfile.cloudinary_id && element.thefiles.firstfile.cloudinary_id){
                cloudinary.uploader.destroy(element.thefiles.firstfile.cloudinary_id);
                cloudinary.uploader.destroy(element.thefiles.secondfile.cloudinary_id);
                console.log(element.cloudinary_id)
            }
        });
        let IMU = await TheLang.deleteMany();
        res.send(IMU);
	})
);

module.exports = LangUploadsRouter;
