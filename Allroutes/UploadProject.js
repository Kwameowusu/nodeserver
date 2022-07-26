const express = require("express");
const ProjUploadsRouter = express.Router();
const AsyncHandler = require("express-async-handler");
const TheProjects = require("../Allmodels/ProjectSchema");
const cloudinary = require("../utilFiles/cloudinary");
const upload = require("../utilFiles/multerFiles");

//Upload all the content
ProjUploadsRouter.post(
    "/post-projects",
    upload.single("file"),
    AsyncHandler(async (req, res) => {
      
        if(req.file.path){
		let result = await cloudinary.uploader.upload(req.file.path);
        let thefiles = {
            tweet: `${req.body.tweet}`,
            link: `${req.body.link}`,
            isChecked: false,
            avatar: result.secure_url,
            cloudinary_id: result.public_id,
        };

        const postingprojects = new TheProjects(thefiles);

         await postingprojects.save();
		res.send({message:" ⚙ Project Posted Successfully"});
    }
    })
);



ProjUploadsRouter.get(
    "/all-projects",
    AsyncHandler(async (req, res) => {
        let PJU = await TheProjects.find();
		res.send(PJU);
     })
);

ProjUploadsRouter.delete(
    "/delete-project/:_id",
    AsyncHandler(async (req, res, next) => {
      
        let PJU = await TheProjects.findByIdAndRemove(req.params._id);
        if(PJU.cloudinary_id){
            await cloudinary.uploader.destroy(PJU.cloudinary_id);
        }
        res.send(PJU);
    })
);

ProjUploadsRouter.delete(
	"/del-all-projs",
	AsyncHandler(async (req, res, next) => {
	
        let IM = await TheProjects.find();
        console.log(IM)
       await IM.forEach(element => {
            console.log(element.cloudinary_id)
            if( element.cloudinary_id ){
                cloudinary.uploader.destroy(element.cloudinary_id);
                console.log(element.cloudinary_id)
            }
        });
        let IMU = await TheProjects.deleteMany();
        res.send(IMU);
	})
);

module.exports = ProjUploadsRouter;
