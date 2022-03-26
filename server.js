//npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

//Log HTTP Requests
app.use(morgan('tiny'));

//testing
app.get('/', (req, res) => {
    const data = {
        working: 'this worked',
        number: 123
    };
    res.json(data);
});

app.listen(PORT, console.log(`Server starting at port ${PORT}`));
