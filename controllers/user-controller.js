const session = require('express-session');
const { restart } = require('nodemon');
const User = require('../models/user-model');

const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.redirect('/auth/google');
    //if (req.user) {
      //  User.find({email: req.user.email}, (err, user) => {
        //    if (err) {
          //      return res.sendStatus(401);
            //}
//
  //          req.user.userId = user._id;
    //        next();
      //  });
    //} else {
      //  console.log("isLoggedIn ERROR: No req.user");
        //return res.sendStatus(401);
    //}
}

getUser = async (req, res) => {
    User.findById(req.user.id).then((err, user) => {
        if (err) {
            return res.status(400).json("Improperly formatted request.");
        }
        else {
            return res.status(200).json({ userInfo: user});
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

//followUser = async (req, res) => {}

module.exports = {
    isLoggedIn,
    getUser,
    deleteUser
}