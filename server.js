//npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require("passport");
const expressSession = require("express-session");
require('./passport-setup');

const app = express();
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || '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';

//sessions
app.use(expressSession({
    name: "story-soft-session",
    saveUninitialized: true,
    resave: false,
    secret: SESSION_SECRET
})); 

//authentication 
app.use(passport.initialize());
app.use(passport.session());

//Log HTTP Requests
app.use(morgan('tiny'));

//import routers
const post_router = require('./routes/post');
const comic_router = require('./routes/comic');
const auth_router = require('./routes/auth');

//connect routers
app.use("/post", post_router);
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

//home page
app.get('/', (req, res) => {
    res.json("HOME PAGE");
});

//invalid request
app.get('*', (req, res) => {
    res.sendStatus(400);
});

app.listen(PORT, console.log(`Server starting at port ${PORT}`));
