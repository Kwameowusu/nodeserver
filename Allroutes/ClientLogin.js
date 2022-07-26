const express = require("express");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const AsyncHandler = require("express-async-handler");
const ClientTheLoginForm = require("../Allmodels/ClientLoginSchema");
const { generateToken } = require("../utilFiles/utils");
const cloudinary = require("../utilFiles/cloudinary");
const upload = require("../utilFiles/multerFiles");

UserRouter.get(
    "/client-all-users",
    AsyncHandler(async (req, res) => {
        let tMF = await ClientTheLoginForm.find();
        res.send(tMF);
    })
);

UserRouter.get(
    "/a-user/:_id",
    AsyncHandler(async (req, res) => {
        // console.log(req.params._id)
        const tMF = await ClientTheLoginForm.findById(req.params._id);
        // console.log(PC)
        res.send({
            name: tMF.name,
            email: tMF.email,
            avatar: tMF.avatar
        });
    })
);

UserRouter.post(
    "/client-sign-up-user",
    upload.single("file"),
    AsyncHandler(async (req, res) => {
        const salt = await bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(req.body.password, salt);
        const name = req.body.name;
        const email = req.body.email;
        const password = hashPassword;

        if (req.file.path) {
            const result = await cloudinary.uploader.upload(req.file.path);

            const visitor = new ClientTheLoginForm({
                name,
                email,
                password,
                avatar: result.secure_url,
                cloudinary_id: result.public_id,
            });

            await visitor.save();
            res.send({ message: "🎇🎉 Sign up Successful" });
        }
    })
);

UserRouter.put(
    "/client-update-user/:_id",
    upload.single("file"),
    AsyncHandler(async (req, res) => {
        const tMF = await ClientTheLoginForm.findById(req.params._id);
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
            (tMF.avatar = result.secure_url),
                (tMF.cloudinary_id = result.public_id),
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

UserRouter.post(
    "/login-client",
    AsyncHandler(async (req, res) => {
        const tMF = await ClientTheLoginForm.findOne({ email: req.body.email });
        console.log(req.body);
        if (!tMF)
            return res.status(404).send({ message: "Oops :) Invalid details" });
        const validPass = await bcrypt.compareSync(
            req.body.password,
            tMF.password
        );
        console.log(validPass);
        if (!validPass)
            return res.status(404).send({ message: "Invalid details" });
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

UserRouter.delete(
    "/client-all-users/:_id",
    AsyncHandler(async (req, res, next) => {
        let tMF = await ClientTheLoginForm.findByIdAndRemove(req.params._id);
        if (tMF.cloudinary_id) {
            await cloudinary.uploader.destroy(tMF.cloudinary_id);
        }
        res.send(tMF);
    })
);
module.exports = UserRouter;
