const session = require('express-session');
const User = require('../models/user-model');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401); //unauthorized
}

getUser = async (req, res) => {
    User.findOne({ email: req.profile.email}, function (err, user) {
        if (err) {
            return res.status(400).json("Improperly formatted request.");
        }
        else {
            return res.status(200).json({ userInfo: user});
        }
    });
}

module.exports = {
    isLoggedIn,
    getUser
}