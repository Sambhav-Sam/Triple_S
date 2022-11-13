const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const User = require("../src/models/userauth");
const randomstring = require("randomstring");
const createUser = require("../src/middleware/authentication/createuser");
const createToken = require("../routes/auth/createtoken");

passport.serializeUser((user,done)=>{
    done(null,user._id);
});

passport.deserializeUser(async (_id,done)=>{
    const user = await User.findOne({_id : _id});
    done(null , user);
});

passport.use(new googleStrategy({
    //options for the google strategy
    callbackURL: '/auth/google/redirect',
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET
}, async (accessToken, refreshToken, profile, done) => {
    //passport callback function
    console.log(profile);
    const username = profile.displayName;
    const email = profile.emails[0].value;
    const password = randomstring.generate(20);
    const user = await createUser(username, email, password);
    const filter = {
        _id: user._id
    }
    const update = {
        googleid: profile.id,
        verify: true
    }
    await User.findOneAndUpdate(filter, update);
    done(null, user);
})
)