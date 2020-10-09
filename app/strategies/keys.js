//add this to .gitignore

module.exports = {
    google:{
        clientID:process.env.GOOGLE_ID,
        clientSecret:process.env.GOOGLE_SECRET
    },
    facebook:{
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_SECRET
    }
}