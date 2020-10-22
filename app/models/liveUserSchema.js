const mongoose = require('mongoose');

var liveUserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    lable:String,
    thumbnail: String,
});
module.exports = mongoose.model('liveUser',liveUserSchema);
