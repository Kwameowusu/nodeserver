const express = require("express");
const ContentsRouter = express.Router();
const AsyncHandler = require("express-async-handler");
const PostContents = require("../Allmodels/ContentSchema");

const cloudinary = require("../utilFiles/cloudinary");
const upload = require("../utilFiles/multerFiles");

ContentsRouter.post(
    "/blog-image",
    upload.single("file"),
    AsyncHandler(async (req, res) => {
        const result = await cloudinary.uploader.upload(req.file.path);

        res.send({
            link: result.secure_url,
        });
    })
);

ContentsRouter.get(
    "/blog-comments/:blog_id",
    AsyncHandler(async (req, res) => {
        // console.log(req.params._id)
        const tMF = await PostContents.findById(req.params._id);
        // console.log(PC)
        res.send({
            name: tMF.name,
            email: tMF.email,
            avatar: tMF.avatar,
        });
    })
);

//Change blog video name
ContentsRouter.post(
    "/upload-video",
    upload.single("file"),
    AsyncHandler(async (req, res) => {
        const result = await cloudinary.uploader.upload(req.file.path);

        res.send({
            link: result.secure_url,
        });
    })
);

//Upload all the content
ContentsRouter.post(
    "/post-contents",
    upload.fields([
        {
            name: "file1",
            maxCount: 1,
        },
        {
            name: "file2",
            maxCount: 1,
        },
    ]),

    AsyncHandler(
        async (req, res) => {
            const name = req.body.name ?? "";
            const category = req.body.category ?? "";
            const title = req.body.title ?? "";
            const content = req.body.content ?? "";
            const date = req.body.date ?? "";
            const isChecked = false;

            console.log(req.body);
            if (req.files.file1[0].path && req.files.file2[0].path) {
            let result1 = await cloudinary.uploader.upload(
                req.files.file1[0].path
            );
            let result2 = await cloudinary.uploader.upload(
                req.files.file2[0].path
            );

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

            const postingblog = new PostContents({
                name,
                category,
                title,
                thefiles,
                content,
                date,
                isChecked,
            });

            await postingblog.save();
            res.send({ message: "Blog  Posted successfully" });
        }
        }
    )
);

ContentsRouter.get(
    "/all-contents",
    AsyncHandler(async (req, res) => {
        // let PC = await PostContents.find().populate()
        let PC = await PostContents.find({})
            .populate("like")
            .populate("comment");
      
        res.send(PC);
    })
);

ContentsRouter.delete(
    "/a-blog/:_id",
    AsyncHandler(async (req, res, next) => {
        // console.log(req.params._id);
        let PC = await PostContents.findByIdAndRemove(req.params._id);
        if (PC.thefiles.firstfile.cloudinary_id) {
            await cloudinary.uploader.destroy(
                PC.thefiles.firstfile.cloudinary_id
            );
        }
        if (PC.thefiles.secondfile.cloudinary_id) {
            await cloudinary.uploader.destroy(
                PC.thefiles.secondfile.cloudinary_id
            );
        }

        res.send(PC);
    })
);

ContentsRouter.delete(
    "/del-all-blogs",
    AsyncHandler(async (req, res, next) => {
        // console.log(req.params._id);
        let MM = await PostContents.find();
        // console.log(IM)
        MM.forEach((element) => {
            // console.log(element.cloudinary_id)
            if (
                element.thefiles.firstfile.cloudinary_id &&
                element.thefiles.secondfile.cloudinary_id
            ) {
                cloudinary.uploader.destroy(
                    element.thefiles.firstfile.cloudinary_id
                );
                cloudinary.uploader.destroy(
                    element.thefiles.secondfile.cloudinary_id
                );
            }
        });
        let IMU = await PostContents.deleteMany();
        res.send(IMU);
    })
);

ContentsRouter.put(
    "/update-blog/:_id",
    upload.fields([
        {
            name: "file1",
            maxCount: 1,
        },
        {
            name: "file2",
            maxCount: 1,
        },
    ]),
    AsyncHandler(async (req, res) => {
        const PC = await PostContents.findById(req.params._id);
console.log(req.params._id)
        PC.name = req.body.name ?? "";
        PC.category = req.body.category ?? "";
        PC.title = req.body.title ?? "";
        PC.content = req.body.content ?? "";
        PC.date = req.body.date ?? "";
        PC.isChecked = false;

        if (
            PC.thefiles.firstfile.cloudinary_id &&
            PC.thefiles.secondfile.cloudinary_id
        ) {
            await cloudinary.uploader.destroy(
                PC.thefiles.firstfile.cloudinary_id
            );
            await cloudinary.uploader.destroy(
                PC.thefiles.secondfile.cloudinary_id
            );
        }

        if (req.files.file1[0] && req.files.file2[0]) {
            let result1 = await cloudinary.uploader.upload(
                req.files.file1[0].path
            );
            let result2 = await cloudinary.uploader.upload(
                req.files.file2[0].path
            );

            (PC.thefiles.firstfile.avatar = result1.secure_url),
                (PC.thefiles.firstfile.cloudinary = result1.public_id),
                (PC.thefiles.secondfile.fieldname = result2.public_id),
                (PC.thefiles.secondfile.originalname = result2.public_id),
        await PC.save();

        res.send({ message: "Blog updated successfully" });
        }
    })
);

ContentsRouter.get(
    "/a-blog/:_id",
    AsyncHandler(async (req, res) => {
        // console.log(req.params._id)
        const PC = await PostContents.findById(req.params._id);
        // console.log(PC)
        res.send(PC);
    })
);

ContentsRouter.get(
    "/search-blogs/:anAboutId",
    AsyncHandler(async (req, res) => {
        const PC = await PostContents.find({
            category: `${req.params.anAboutId}`,
        });
        res.send(PC);
    })
);

module.exports = ContentsRouter;
