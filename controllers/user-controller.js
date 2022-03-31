const session = require('express-session');
const User = require('../models/user-model');

function isLoggedIn(req, res, next) {
    if (req.user) {
        User.find({email: req.user.email}, (err, user) => {
            if (err) {
                return res.sendStatus(401);
            }

            req.user.userId = user._id;
            next();
        });
    } else {
        console.log("isLoggedIn ERROR: No req.user");
        return res.sendStatus(401);
    }
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