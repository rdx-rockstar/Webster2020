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
    User.findOne({"googleId": profile.id},function(err,currentUser){
        if(err){
            console.log(err);
            return done(err);
        }
        if(!currentUser)
        {
            currentUser = new User({
                username : profile.displayName +" "+ profile.id,
                email: profile.emails[0].value,
                googleId : profile.id,
                googleProfilePicture: profile._json.picture,
                provider: 'google',
            });
            currentUser.save(function(err){
                if(err){
                    console.log(err);
                    return done(err,currentUser);
                }
                return done(null,currentUser);
            })
        }
        else{
            return done(null,currentUser);
        }
    })
}));

passport.use(new FacebookStrategy({
    clientID: keys.facebook.appId,
    clientSecret: keys.facebook.appSecret,
    callbackURL: "/auth/facebook/redirect",
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({'facebookId': profile.id},function(err,currentUser){
        if(err){
            console.log(err);
            return done(err);
        }
        if(!currentUser)
        {
            currentUser = new User({
                username : profile.displayName +" "+ profile.id,
                email: profile.id,
                facebookId : profile.id,
                provider: 'facebook',
            });
            currentUser.save(function(err){
                if(err){
                    console.log(err);
                    return done(err,currentUser);
                }
                return done(null,currentUser);
            })
        }
        else{
            return done(null,currentUser);
        }
    })
  }
));