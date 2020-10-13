
const mongoose = require('mongoose');
const passportLocalMongoose= require('passport-local-mongoose');  //for auth for local("passport-local: lib")("passport-local-mongoose:plug-in")

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleUsername: String,
    googleId: String,
    facebookUsername: String,
    facebookId: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);
