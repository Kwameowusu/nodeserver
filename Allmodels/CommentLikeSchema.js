const mongoose = require("mongoose");

const CommentLikeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
   
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "postContents",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "theloginform",
    }
});

const TheCommentLike = mongoose.model("thelikecomment", CommentLikeSchema);
module.exports = TheCommentLike;
