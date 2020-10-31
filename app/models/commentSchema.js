const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        email: String,
        dp: String
    },
    message: String,
    time: String,
});

module.exports = mongoose.model("Comment",commentSchema);