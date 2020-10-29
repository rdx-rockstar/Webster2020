const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    videoURL: String,
    thumbnail: String,
    caption: String,
    createdBy:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        email: String
    },
    creationDate: {
        type: Date,
        default: Date.now(),
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    likes: {
        type: Number,
        default: 0
    },
    likedBy:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    tags: String,
});

module.exports = mongoose.model('Post',postSchema);