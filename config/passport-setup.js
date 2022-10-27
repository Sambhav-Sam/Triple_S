require("dotenv").config();
const passport= require("passport");
const googleStrategy = require("passport-google-oauth20");

passport.use(new googleStrategy({
    //options for the google strategy
    callbackURL:'/auth/google/redirect',
    clientID:process.env.CLIENTID,
    clientSecret:process.env.CLIENTSECRET
},(accessToken,refreshToken,profile,done)=>{
    //passport callback function
    console.log(profile);
    done(null,profile);
})
)