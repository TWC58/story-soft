//npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require('cors')

require('./passport-setup');

const app = express();
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || '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';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
console.log(`FRONTEND_URL: ${FRONTEND_URL}`);

//sessions
app.use(cookieSession({
    secret: SESSION_SECRET,
    keys: ['oursuperspecialkey']
})); 

//authentication 
app.use(cors({credentials: true, origin: FRONTEND_URL}));
//app.use(cors({credentials: true, origin: 'https://accounts.google.com/o/oauth2/v2/auth'}));
app.use(passport.initialize());
app.use(passport.session());

//JSON body parsing
app.use(express.json({limit: '50mb'}));

//Log HTTP Requests
app.use(morgan('tiny'));

//import routers
const post_router = require('./routes/post');
const comic_router = require('./routes/comic');
const auth_router = require('./routes/auth');
/*
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
*/
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
    res.redirect(FRONTEND_URL);
});

app.get('/cors', (req, res) => { //TODO change to client once local testing complete
    res.set('Access-Control-Allow-Origin', FRONTEND_URL);
    res.send({ "msg": "This has CORS enabled ????" })
})

//invalid request
app.get('*', (req, res) => {
    res.sendStatus(400);
});

app.listen(PORT, console.log(`Server starting at port ${PORT}`));
