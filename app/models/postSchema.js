const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    // videoURL: String,
    // thumbnail: String,
    image: String,
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
    likedBy:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model('Post',postSchema);