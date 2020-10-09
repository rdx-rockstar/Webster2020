const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');
const User = require('../models/userSchema');



passport.use(new GoogleStrategy({
    clientID:keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/redirect'
},(accessToken,refreshToken,profile,done) => {
    console.log(profile);
    User.findOne({googleId: profile.id},function(err,currentUser){
        if(err){
            console.log(err);
            return done(err);
        }
        if(!currentUser)
        {
            currentUser = new User({
                googleUsername: profile.displayName,
                googleId: profile.id
            });
            currentUser.save(function(err){
                if(err){
                    console.log(err);
                }
                return done(err,currentUser);
            })
        }
        else{
            return done(err,currentUser);
        }
    })
}));

passport.use(new FacebookStrategy({
    clientID: keys.facebook.appId,
    clientSecret: keys.facebook.appSecret,
    callbackURL: "/auth/facebook/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({facebookId: profile.id},function(err,currentUser){
        if(err){
            console.log(err);
            return done(err);
        }
        if(!currentUser)
        {
            currentUser = new User({
                facebookUsername: profile.displayName,
                facebookId: profile.id
            });
            currentUser.save(function(err){
                if(err){
                    console.log(err);
                }
                return done(err,currentUser);
            })
        }
        else{
            return done(err,currentUser);
        }
    })
  }
));