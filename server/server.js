const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieSession = require('cookie-session')
const passport = require('passport')
require('dotenv').config();
require('./config/passport-config')

const MONGO_URI = process.env.Mongo_Uri;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
        console.log("DB connected..")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

connectDB()

const app = express()
app.use(cors())
app.use(express.json({ extended: true }))
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}))
const isLoggedin = (req, res, next) => {
    if (req.user) next();
    else res.sendStatus(401);
}
app.use(passport.initialize())
app.use(passport.session())

// routes 
app.get('/', (req, res) => res.send('HomePage'))
app.get('/failed', (req, res) => res.send('you failed login'));
app.get('/success', isLoggedin, (req, res) => console.log(`Welcome Mr. ${req.user.email} and ${req.user.displayName}`));

app.get('/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/success');
    }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(3001, () => console.log('on port 3001'));