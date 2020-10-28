const mongoose = require('mongoose');
const passportLocalMongoose= require('passport-local-mongoose');  //for auth for local("passport-local: lib")("passport-local-mongoose:plug-in")

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    email: String,
    password: String,
    googleId: String,
    profilePicture: {
        type: String,
        default: '/images/default.png'
    },
    facebookId: String,
    provider: String,
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    subscriptions:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

userSchema.plugin(passportLocalMongoose,{usernameField: 'username'});

module.exports = mongoose.model('User',userSchema);
