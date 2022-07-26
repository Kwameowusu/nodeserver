const express = require("express");
const UserRouter = express.Router();
const bcrypt = require("bcrypt")
const AsyncHandler = require("express-async-handler");
const TheLoginForm = require("../Allmodels/LoginSchema");
const { generateToken } = require("../utilFiles/utils");
const cloudinary = require("../utilFiles/cloudinary");
const upload = require("../utilFiles/multerFiles");


/** Temporal Registering Owner of the dashBoard **/
/*Registering the Owner*/

UserRouter.post(
	"/reg-owner",
	AsyncHandler(async (req, res) => {
		const salt =  bcrypt.genSaltSync(10);
		const hashPassword =  bcrypt.hashSync(req.body.password, salt);

		const name = req.body.name;
		const email = req.body.email;
		const password = hashPassword;
		const adminImg = req.body.adminImg;
		const userType = req.body.userType;
		const isChecked = req.body.isChecked;
		const isOpen = req.body.isOpen;

		const visitor = new TheLoginForm({
			name,
			email,
			password,
			adminImg,
			userType,
			isChecked,
			isOpen,
		});

		let thevisitor = await visitor.save();
		res.send(thevisitor);
	})
);

/* Log in Owner and Amdin */
UserRouter.post(
	"/login-all",
	AsyncHandler(async (req, res) => {
		const tMF = await TheLoginForm.findOne({ email: req.body.email });
		if (!tMF)
			return res.status(404).send({ message: "Oops :) Invalid details" });
		const validPass = await bcrypt.compareSync(req.body.password, tMF.password);
		if (!validPass) return res.status(404).send({ message: "Invalid details" });
		res.send({
			_id: tMF._id,
			name: tMF.name,
			email: tMF.email,
			userType: tMF.userType,
			isChecked: tMF.isChecked,
			filename: tMF.avatar,
			token: generateToken(tMF),
			message: "Login successful"
		});
	})
);

/***New Users Apart from Owner**
/* Getting all the users from the backend */

UserRouter.get(
	"/all-users",
	AsyncHandler(async (req, res) => {
		let tMF = await TheLoginForm.find();
		res.send(tMF);
	})
);


UserRouter.post(
	"/add-user",
	upload.single("file"),
	AsyncHandler(async (req, res) => {
		const salt =  bcrypt.genSaltSync(10);
		const hashPassword =  bcrypt.hashSync(req.body.password, salt);
		const name = req.body.name;
		const email = req.body.email;
		const password = hashPassword;
	
		if (req.file.path) {
			const result = await cloudinary.uploader.upload(req.file.path);

			const visitor = new TheLoginForm({
				name,
				email,
				password,
				avatar: result.secure_url,
				cloudinary_id: result.public_id,
			});

			await visitor.save();
			res.send({ message: "🎇🎉 User Added Successfully" });
		}
	})
);

UserRouter.put(
	"/update-user/:_id",
	upload.single("file"),
	AsyncHandler(async (req, res) => {
		const tMF = await TheLoginForm.findById(req.params._id);
		const salt = await bcrypt.genSaltSync(10);
		const hashPassword = await bcrypt.hashSync(req.body.password, salt);

		if (tMF) {

			if (req.file.path && tMF.cloudinary_id) {
				await cloudinary.uploader.destroy(tMF.cloudinary_id);
			}

			let result = await cloudinary.uploader.upload(req.file.path);
			tMF.name = req.body.name;
			tMF.email = req.body.email;
			tMF.password = hashPassword;
			tMF.avatar = result.secure_url,
				tMF.cloudinary_id = result.public_id,

				await tMF.save();

			res.send({
				_id: tMF._id,
				name: tMF.name,
				email: tMF.email,
				userType: tMF.userType,
				isChecked: tMF.isChecked,
				filename: tMF.avatar,
				token: generateToken(tMF),
				message: "😋🤩 User Updated Successfully",
			});
		} else {
			res.status(404).send({ message: "User Not Found" });
		}
	})
);

UserRouter.delete(
	"/all-users/:_id",
	AsyncHandler(async (req, res, next) => {
		let tMF = await TheLoginForm.findByIdAndRemove(req.params._id);
		if (tMF.cloudinary_id) {
			 await cloudinary.uploader.destroy(tMF.cloudinary_id);
		
		}
		res.send(tMF);
	})
);
module.exports = UserRouter;
