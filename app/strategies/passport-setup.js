const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
// const keys = require('./keys');

passport.use(new GoogleStrategy({
    clientID:'45047464430-5slrtpctfh3anr0t722jbjce19seujnf.apps.googleusercontent.com',
    clientSecret: 'HX1yNdA1OAJ9xGOJf_FEWNH4',
    callbackURL: '/auth/google/redirect'
},() => {

}));