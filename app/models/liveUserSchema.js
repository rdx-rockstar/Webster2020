const mongoose = require('mongoose');

var liveUserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    name:String,
    lable:String,
    pic:String,
    thumbnail: String,
    uid:String,
});
module.exports = mongoose.model('liveUser',liveUserSchema);
