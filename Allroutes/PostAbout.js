const express = require("express");
const AboutRouter = express.Router();
const AsyncHandler = require("express-async-handler");
const TheAbout = require("../Allmodels/AboutSchema");

AboutRouter.post(
    "/post-about",
    AsyncHandler(async (req, res) => {
        // console.log(req.body);

        let theabout = {
            about: `${req.body.about}`,
            isChecked: false
        };


        const postingabout = new TheAbout(theabout);
         await postingabout.save();
        res.send({message: "About Posted Successfully"});
    })
);


AboutRouter.get(
    "/all-abouts",
    AsyncHandler(async (req, res) => {
        let AU = await TheAbout.find();
        res.send(AU);
    })
);

AboutRouter.get(
    "/an-abouts/:anAboutId",
    AsyncHandler(async (req, res) => {
        const AU = await TheAbout.findById(req.params.anAboutId);
        //   console.log(AU)
        res.send(AU);
    })
);


AboutRouter.put(
    "/update-about/:_id",

    AsyncHandler(async (req, res) => {
     
        // console.log(req.body.about);
        const AU = await TheAbout.findOneAndUpdate(req.params._id);

        AU.about = req.body.about;
        AU.isChecked = false

        await AU.save();

        res.send({ message: "About updated successfully" });
    })
);

AboutRouter.delete(
    "/del-all-about/:_id",
    AsyncHandler(async (req, res, next) => {
        // console.log(req.params._id);
        let AU = await TheAbout.findByIdAndRemove(req.params._id);
        res.send(AU);
    })
);


AboutRouter.delete(
    "/del-all-abouts",
    AsyncHandler(async (req, res, next) => {
        // console.log(req.params._id);
        let PLU = await TheAbout.deleteMany();
        res.send(PLU);
    })
);

module.exports = AboutRouter;
