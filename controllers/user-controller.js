const session = require('express-session');
const { restart } = require('nodemon');
const User = require('../models/user-model');

function isLoggedIn(req, res, next) {
    if(req.user) { //logged in
        next();
    } 
    else { //not logged in
        res.sendStatus(401); //unauthorized
    }
}

getUser = async (req, res) => {
    User.findOne({ email: req.profile.email}).then((err, user) => {
        if (err) {
            return res.status(400).json("Improperly formatted request.");
        }
        else {
            return res.status(200);//.json({ userInfo: user});
        }
    });
}

deleteUser = async (req, res) => {
    User.deleteOne({ _id: req.user.id }).then((writeConcernDoc, deletedCount) => {
        if(deletedCount) { //successfully deleted
            return res.status(200).json("successfully deleted");
        }
        else { //user didn't exist
            return res.status(400).json("user does not exist");
        }
    });

}

//followUser

module.exports = {
    isLoggedIn,
    getUser,
    deleteUser
}