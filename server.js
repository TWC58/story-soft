//npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require("passport");

const session = require("express-session");
require('./passport-setup');

const app = express();
const PORT = process.env.PORT || 8080;
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret';

//sessions
app.use(session({
    name: "story-soft-cookie",
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET
})); 

//Log HTTP Requests
app.use(morgan('tiny'));

//authentication 
app.use(passport.initialize());
app.use(passport.session());

//import routers
const story_router = require('./routes/story');
const comic_router = require('./routes/comic');
const auth_router = require('./routes/auth');

//connect routers
app.use("/story", story_router);
app.use("/comic", comic_router);
app.use("/auth", auth_router);

//Connect to mongodb
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://storysoftcse416:McK1lla_Gor1lla@cluster0.sebe4.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Log connection
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected...');
});

//testing
app.get('*', (req, res) => {
    res.json("DEFAULT PAGE");
});

app.listen(PORT, console.log(`Server starting at port ${PORT}`));
