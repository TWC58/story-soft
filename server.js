//npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

//import routers
const story_router = require('./routes/story');
const comic_router = require('./routes/comic');
const auth_router = require('./routes/auth');

//Log HTTP Requests
app.use(morgan('tiny'));

//connect routers
app.use("/story", story_router);
app.use("/comic", comic_router);
app.use("/auth", auth_router);

//Connect to mongodb
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://storysoftcse416:McK1lla_Gor1lla@cluster0.sebe4.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology:true
});

//Log connection
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected...');
});

//testing
app.get('/', (req, res) => {
    const data = {
        working: 'this worked',
        number: 123
    };
    res.json(data);
});

app.listen(PORT, console.log(`Server starting at port ${PORT}`));
