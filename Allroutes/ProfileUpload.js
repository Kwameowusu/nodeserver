const express = require("express");
const ProfileUploadsRouter = express.Router();
const AsyncHandler = require("express-async-handler");
const Profile = require("../Allmodels/ProfileSchema");
const multer = require("multer");
// const fs = require("fs");
const cloudinary = require("../utilFiles/cloudinary");
const upload = require("../utilFiles/multerFiles");

//for general file upload


//Upload all the content
ProfileUploadsRouter.put(
    "/post-profile",
    upload.single("file"),
    AsyncHandler(async (req, res) => {
        const PU = await Profile.findOneAndUpdate({ filename: "file" });
        // console.log(PU)

        if (PU === null && req.file.path) {
           
             const result = await cloudinary.uploader.upload(req.file.path);
            

            const postingprofile = new Profile({
                avatar: result.secure_url,
                cloudinary_id: result.public_id,
            });
            await postingprofile.save();
            res.send({
                message: "🤩(❁´◡`❁) Profile Posted Successfully",
            });
        } else {
            // console.log(PU.path);
            if(PU.cloudinary_id){
                await cloudinary.uploader.destroy(PU.cloudinary_id);
            }
            if(req.file.path){
                const result = await cloudinary.uploader.upload(req.file.path);
        
            (PU.isChecked = false),
                (PU.avatar = result.secure_url),
                (PU.cloudinary_id = result.public_id),
                await PU.save();
            res.send({
                filename: PU.cloudinary_id,
                message: "🤩 Profile Updated Successfully",
            });
        }
        }
    })
);

ProfileUploadsRouter.get(
    "/a-profile",
    AsyncHandler(async (req, res) => {
        let PJU = await Profile.find();
        res.send(PJU);
    })
);

// ProfileUploadsRouter.delete(
//     "/delete-profile/:afile",
//     AsyncHandler(async (req, res, next) => {
//         let PRU = await Profile.findByIdAndRemove(req.params.afile);
//         res.send(PRU);

//       
//     })
// );

module.exports = ProfileUploadsRouter;
