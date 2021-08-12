const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User')

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: "996736391010-v3i7ok91t16jnbmnhb60fbkpndo33204.apps.googleusercontent.com",
    clientSecret: "hgnaUquigs7Ggnq6Bx18z4Ow",
    callbackURL: "http://localhost:3001/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile)
    }
));