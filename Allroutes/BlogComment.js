const express = require("express");
const app = express();
// const http = require("http");
// const { Server } = require("socket.io");
const CommentRouter = express.Router();
const AsyncHandler = require("express-async-handler");
const PostComment = require("../Allmodels/CommentSchema");
const PostLikes = require("../Allmodels/CommentLikeSchema");
const PostContents = require("../Allmodels/ContentSchema");

CommentRouter.get(
    "/blog-comments/:blog_id",
    AsyncHandler(async (req, res) => {
        // console.log(req.params.blog_id);
        const tMF = await PostComment.find({
            blogId: `${req.params.blog_id}`,
        });
        // socket.emit("getComments", tMF);
        // console.log(tMF);
        res.send(tMF);
    })
);
/*  Per what you have discussed, it
    means you have much understanding
    about life. Keep it up 😋😋 */

CommentRouter.post(
    "/post-comment",
    AsyncHandler(async (req, res) => {
        if (req.body.userId && req.body.blogId) {
            let thecomment = {
                name: `${req.body.name}`,
                comment: `${req.body.comment}`,
                avatar: `${req.body.avatar}`,
                blogId: `${req.body.blogId}`,
                userId: `${req.body.userId}`,
                date: `${req.body.date}`,
                isChecked: false,
            };

            io.emit("comment", thecomment);

            const postingcom = new PostComment(thecomment);
            // console.log(postingcom);
            await postingcom.save();

            console.log(req.body.blogId);
            const CM = await PostComment.findOne({
                blogId: `${req.body.blogId}`,
            });

            // io.emit("comment", CM);

            const tMF = await PostContents.findOne({
                _id: `${req.body.blogId}`,
            });

            tMF.comment.push(CM._id);
            await tMF.save();
            res.send({ message: "Comment Posted Successfully" });
        }
    })
);

CommentRouter.get(
    "/blog-likes/:blog_id",
    AsyncHandler(async (req, res) => {
        // console.log(req.params.blog_id);
        const tMF = await PostLikes.find({
            blogId: `${req.params.blog_id}`,
        });
        // console.log(tMF);
        res.send(tMF);
    })
);

CommentRouter.post(
    "/post-like",
    AsyncHandler(async (req, res) => {
        if (req.body.blogId && req.body.userId) {
            const tMF = await PostLikes.findOne({
                blogId: req.body.blogId,
                userId: req.body.userId,
            });
            // console.log(tMF);
            if (!tMF || tMF === null || tMF.length === 0) {
                console.log("hey");
                let theabout = {
                    name: `${req.body.name}`,
                    blogId: `${req.body.blogId}`,
                    userId: `${req.body.userId}`,
                    isChecked: false,
                };
                const postingabout = new PostLikes(theabout);
                await postingabout.save();
                const CM = await PostLikes.findOne({
                    blogId: `${req.body.blogId}`,
                    userId: `${req.body.userId}`,
                });
                const tMF = await PostContents.findOne({
                    _id: `${req.body.blogId}`,
                });

                tMF.like.push(CM._id);
                await tMF.save();
                const MM = await PostLikes.find({
                    blogId: `${req.body.blogId}`,
                });
                console.log(MM)
                io.emit("likes", MM);

                res.send({ message: 1 });
            } else {
                console.log("yo");

                const CM = await PostLikes.findOne({
                    blogId: `${req.body.blogId}`,
                    userId: `${req.body.userId}`,
                });
                // console.log(CM);
                const tMF = await PostContents.findOne({
                    _id: CM.blogId,
                });

                tMF.like.pull(CM._id);
                await tMF.save();

                await PostLikes.deleteOne({
                    blogId: req.body.blogId,
                    userId: req.body.userId,
                });
                const tM = await PostLikes.find({
                    blogId: `${req.body.blogId}`,
                });
                // console.log(tM)
                io.emit("likes", tM);
               
                res.send({ message: 2 });
            }
        }
    })
);

module.exports = CommentRouter;
