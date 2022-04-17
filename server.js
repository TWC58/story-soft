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

//sessions
app.use(cookieSession({
    secret: SESSION_SECRET,
    keys: ['oursuperspecialkey']
})); 

//authentication 
app.use(cors({credentials: true, origin: FRONTEND_URL}));
//app.use(cors({credentials: true, origin: 'http://https://accounts.google.com/o/oauth2/v2/auth'}));
app.use(passport.initialize());
app.use(passport.session());

//JSON body parsing
app.use(express.json());

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
    res.redirect(FRONTEND_URL);
});

app.get('/cors', (req, res) => { //TODO change to client once local testing complete
    res.set('Access-Control-Allow-Origin', FRONTEND_URL);
    res.send({ "msg": "This has CORS enabled 🎈" })
})

//invalid request
app.get('*', (req, res) => {
    res.sendStatus(400);
});

app.listen(PORT, console.log(`Server starting at port ${PORT}`));
