const User = require('../models/user-model');

const isLoggedIn = (req, res, next) => {
    if(req.user) { //update to authenticate
        next();
    }
    else {
        res.sendStatus(401); //unauthorized
    }
}

module.exports = {
    isLoggedIn
}