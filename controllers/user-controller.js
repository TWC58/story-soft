const User = require('../models/user-model');

const isLoggedIn = (req, res, next) => {
    if(req.user) { //update to authenticate
        next();
    }
    else {
        res.sendStatus(401); //unauthorized
    }
}

getUser = async (req, res) => {
    User.findOne({ _id: req.params.id}, function (err, user) {
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