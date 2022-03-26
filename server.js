//npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
//const routes = require('./routes/api');

//Log HTTP Requests
app.use(morgan('tiny'));

//Connect to mongodb
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/story-soft', {
  //  useNewUrlParser: true,
    //useUnifiedTopology:true
//});

//Log connection
//mongoose.connection.on('connected', () => {
  //  console.log('Mongoose is connected...');
//});

//testing
app.get('/', (req, res) => {
    const data = {
        working: 'this worked',
        number: 123
    };
    res.json(data);
});

//If running on Heroku
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('build'));
}

app.listen(PORT, console.log(`Server starting at port ${PORT}`));
