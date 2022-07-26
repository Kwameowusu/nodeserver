const mongoose = require("mongoose");

const PostContentsSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // 	unique: true,
    },

    category: {
        type: String,
        // required: true,
        // 	unique: true,
    },
    title: {
        type: String,
        // required: true,
        // 	unique: true,
    },
    date: {
        type: String,
    },
    isChecked: {
        type: Boolean,
        default: false,
    },
    isOpened: {
        type: Boolean,
        default: false,
    },
    thefiles: {
        firstfile: {
            avatar: {
                type: String,
            },
            cloudinary_id: {
                type: String,
            },
        },
        secondfile: {
            avatar: {
                type: String,
            },
            cloudinary_id: {
                type: String,
            },
        },
    },
    content: {
        type: String,
    },
    comment: [{ type: mongoose.Types.ObjectId, ref: "thecomment" }],
    like: [{ type: mongoose.Types.ObjectId, ref: "thelikecomment" }],
   
});

const PostContents = mongoose.model("postContents", PostContentsSchema);

module.exports = PostContents;
