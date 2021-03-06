const session = require('express-session');
const { restart } = require('nodemon');
const User = require('../models/user-model');
const ComicPost = require('../models/comic-post-model');
const StoryPost = require('../models/story-post-model');
const Comments = require('../models/comment-model')
const mongoose = require('mongoose');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const isLoggedIn = (req, res, next) => {
    console.log("isLoggedIn:", req.user);
    req.user ? next() : res.redirect('/auth/google'); //ACTUAL
    //next(); //TESTING
}

getUserInfo = async (req, res) => {
    User.findById(req.params.id).then((user) => {
        return res.status(200).json({
            username: user.username,
            _id: req.params.id,
            profile_pic_url: user.profile_pic_url,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            likes: user.likes,
            dislikes: user.dislikes,
            bookmarks: user.bookmarks
        });
    })
        .catch(error => {
            if (error) {
                console.log("FAILURE: " + error);
                return res.status(500).json({
                    error,
                    message: 'User database query failed.',
                })
            }
        })
}

getLoggedIn = async (req, res) => {
    console.log("getting logged in");
    User.findById(req.user.id).then((user) => {
        console.log("User found and sending: ", user);
        res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
        return res.status(200).json(user);
    })
        .catch(error => {
            if (error) {
                console.log("FAILURE: " + error);
                return res.status(500).json({
                    error,
                    message: 'User database query failed.',
                })
            }
        })
}

deleteUser = async (req, res) => {
    //delete likes, posts, following
    console.log("DELETE USER ENTERED");
    //find user
    User.findById(req.user.id).then((user) => {
        console.log(user);
        //user not found
        if (!user) {
            return res.status(400).json("USER DOES NOT EXIST");
        }

        //decrement likes for both comic and story
        if (user.likes) {
            console.log(user.likes);
            user.likes.forEach(postID => {
                console.log("DECREMENTING LIKES: ", postID);
                ComicPost.findByIdAndUpdate(postID, { $inc: { likes: -1 } }, function(err, docs) { if(err) console.log(err)});
                StoryPost.findByIdAndUpdate(postID, { $inc: { likes: -1 } }, function(err, docs) { if(err) console.log(err)});
            });
        }
        //same for dislikes
        if (user.dislikes) {
            user.dislikes.forEach(postID => {
                console.log("DECREMENTING DISLIKES: ", postID);
                ComicPost.findByIdAndUpdate(postID, { $inc: { dislikes: -1 } }, function(err, docs) { if(err) console.log(err)});
                StoryPost.findByIdAndUpdate(postID, { $inc: { dislikes: -1 } }, function(err, docs) { if(err) console.log(err)});
            });
        }
        //delete posts
        userID = user.id;
        console.log(userID);
        StoryPost.deleteMany({ 'userData.userId': userID }, function(err, docs) { if(err) console.log(err)});
        ComicPost.deleteMany({ 'userData.userId': userID }, function(err, docs) { if(err) console.log(err)});

        //delete from following lists
        if (user.following) {
            user.following.forEach(followingID => {
                console.log("REMOVING FOLLOWER");
                User.findByIdAndUpdate(followingID, { $pull: { followers: user._id } }, function(err, docs) { if(err) console.log(err)});
            });
        }

        //delete from followers following lists
        if (user.followers) {
            user.followers.forEach(followerID => {
                console.log("REMOVING FOLLOWER");
                User.findByIdAndUpdate(followerIDuser, { $pull: { following: user._id } }, function(err, docs) { if(err) console.log(err)});
            });
        }

        console.log("NOW DELETING USER : " + req.user.id);
        User.findByIdAndDelete((req.user.id), (err, docs) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("USER DELETED");
            }
        });
        return res.status(200).json("delete successful");
    }).catch(err => {
        console.log("FAILURE: " + err);
        return res.status(500).json({
            err,
            message: 'User database delete query failed.',
        });
    });
}

followUser = async (req, res) => {
    followerID = req.body.follower;
    followedID = req.body.followed;
    console.log("FOLLOWER:\t" + followerID + "\nFOLLOWED:\t" + followedID);
    if (req.user.id == followerID) { //authorize

        //update follower's following list
        User.findByIdAndUpdate(followerID, { $push: { following: followedID } })
            .catch(err => {
                console.log(err);
                return res.status(500);
            });

        //update followed's followers list
        User.findByIdAndUpdate(followedID, { $push: { followers: followerID } })
            .catch(err => {
                console.log(err);
                return res.status(500);
            });
        return res.status(200).json("FOLLOW SUCCESSFUL");
    }
    else {
        return res.status(401).json("UNAUTHORIZED FOLLOW REQUEST");
    }
}

unfollowUser = async (req, res) => {
    unfollowerID = req.body.unfollower;
    unfollowedID = req.body.unfollowed;
    console.log("UNFOLLOWER:\t" + unfollowerID + "\nUNFOLLOWED:\t" + unfollowedID);
    if (1) {//req.user.id == unfollowerID){ //authorize

        //update unfollower's following list
        User.findByIdAndUpdate(unfollowerID, { $pull: { following: unfollowedID } })
            .catch(err => {
                console.log(err);
                return res.status(500);
            });

        //update unfollowed's followers list
        User.findByIdAndUpdate(unfollowedID, { $pull: { followers: unfollowerID } })
            .catch(err => {
                console.log(err);
                return res.status(500);
            });
        return res.status(200).json("UNFOLLOW SUCCESSFUL");
    }
    else { return res.status(401).json("UNAUTHORIZED UNFOLLOW REQUEST"); }
}

updateUser = async (req, res) => {
    userID = req.body.id;
    console.log("Updating: ", req.body);
    if (req.user.id == userID) { //ACTUAL
        User.findByIdAndUpdate(userID, {
            username: req.body.username,
            profile_pic_url: req.body.profile_pic_url,
            bio: req.body.bio
        }, { new: true }, function (err, user) {
            if (err) {
                console.log(err);
                return res.status(500);
            }
            StoryPost.updateMany({ 'userData.userId': req.user.id }, { 'userData.username': req.body.username }, function(err, docs) { if(err) console.log(err)});
            ComicPost.updateMany({ 'userData.userId': req.user.id }, { 'userData.username': req.body.username }, function(err, docs) { if(err) console.log(err)});

            return res.status(200).json(user);
        });
    }
    else { return res.status(401).json("UNAUTHORIZED UPDATEUSER REQUEST"); }
}

updateBookmarks = async (req, res) => {
    userID = req.body.userID;
    if (1) {//req.user.id == userID){ //ACTUAL$push: { bookmarks: { postID: req.body.postID, sectionID: req.body.sectionID } }
        User.findByIdAndUpdate(userID, { $pull: { bookmarks: { postID: req.body.postID } } })
            .catch(err => {
                console.log(err);
                return res.status(500);
            });
        User.findByIdAndUpdate(userID, { $push: { bookmarks: { postID: req.body.postID, sectionID: req.body.sectionID } } })
            .catch(err => {
                console.log(err);
                return res.status(500);
            });
        return res.status(200).json("UPDATE BOOKMARKS SUCCESSFUL");
    }
    else { return res.status(401).json("UNAUTHORIZED UPDATEBOOKMARKS REQUEST") };
}

module.exports = {
    isLoggedIn,
    getUserInfo,
    getLoggedIn,
    deleteUser,
    followUser,
    unfollowUser,
    updateUser,
    updateBookmarks
}