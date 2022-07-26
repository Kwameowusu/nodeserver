const express = require("express");
const router = express.Router();
const TheMessageForm = require("../Allmodels/MessageSchema");
const AsyncHandler = require("express-async-handler");

router.post(
	"/post-messages",
	AsyncHandler(async (req, res) => {
		const email = req.body.email;
		const message = req.body.message;
		const date = req.body.ndate;
		const isChecked = req.body.isCheck;

		const visitor = new TheMessageForm({
			email,
			message,
			date,
			isChecked,
		});

		let thevisitors = await visitor.save();
		res.send(thevisitors);
	})
);

// router.get("/posts", async (req, res) => {
// 	const Messposts = await TheMessageForm.find()
// 	res.send(Messposts)
// })

router.get(
	"/all-messages",
	AsyncHandler(async (req, res) => {
		let tMF = await TheMessageForm.find();
		res.send(tMF);
	})
);

// router.delete("/:_id", (req, res) => {
//"start": "set PORT=3006 && react-scripts start"
// });

router.delete(
	"/all-messages/:_id",
	AsyncHandler(async (req, res, next) => {
		console.log(req.params._id);
		let tMF = await TheMessageForm.findByIdAndRemove(req.params._id);
		res.send(tMF);
	})
);

router.delete(
	"/del-all-messages",
	AsyncHandler(async (req, res, next) => {
		// console.log(req.params._id);
		let tMF = await TheMessageForm.deleteMany();
		res.send(tMF);
	})
);

module.exports = router;
