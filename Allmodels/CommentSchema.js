const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    comment: {
        type: String,
    },
    avatar: {
        type: String,
    },
    date: {
        type: String,

    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "postContents",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "theloginform",
    },
    isChecked: {
        type: Boolean,
    },
});

const TheComment = mongoose.model("thecomment", CommentSchema);

module.exports = TheComment;
