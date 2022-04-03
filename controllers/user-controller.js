const session = require('express-session');
const { restart } = require('nodemon');
const User = require('../models/user-model');
const ComicPost = require('../models/comic-post-model');
const StoryPost = require('../models/story-post-model');

const isLoggedIn = (req, res, next) => {
    //req.user ? next() : res.redirect('/auth/google'); //ACTUAL
    next(); //TESTING
}

getUserInfo = async (req, res) => {
    User.findById(req.params.id).then((user) => {
        return res.status(200).json({ 
            username: user.username,
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
        if(error){
        console.log("FAILURE: " + JSON.stringify(error));
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
    if(1){//(req.user.id == req.params.id) {
        
        //find user
        User.findById(req.params.id).then((user) => {
            
            //user not found
            if(!user){ 
                return res.status(400).json("USER DOES NOT EXIST");
            }
            //decrement likes for both comic and story
            if(user.likes){
        user.likes.forEach(postID => {
            console.log("DECREMENTING LIKES");
            ComicPost.findByIdAndUpdate(postID, { $inc: {likes: -1} });
            StoryPostModel.findByIdAndUpdate(postID, { $inc: {likes: -1} });
        });}
        //same for dislikes
        if(user.dislikes){
        user.dislikes.forEach(postID => {
            console.log("DECREMENTING DISLIKES");
            ComicPost.findByIdAndUpdate(postID, { $inc: {dislikes: -1} });
            StoryPostModel.findByIdAndUpdate(postID, { $inc: {dislikes: -1} });
        });}
        //delete posts
        StoryPost.deleteMany({ userData: {userId: user._id}});
        ComicPost.deleteMany({ userData: {userId: user._id}});
        //delete from following lists
        if(user.following){
        user.following.forEach(followingID => {
            console.log("REMOVING FOLLOWER");
            User.updateOne({_id : followingID}, {$pull: {followers: {_id: user._id}}});
        });}
        console.log("NOW DELETING USER : "+req.params.id);
        User.findByIdAndDelete((req.params.id), (err, docs) => {
            if(err){
                console.log(err);
            }
            else{
                console.log("USER DELETED");
            }
        });
        return res.status(200).json("delete successful");
    })
    .catch(error => {
        if(error){
        console.log("FAILURE: " + JSON.stringify(error));
        return res.status(500).json({
            error,
            message: 'User database delete query failed.',
        })
    }
    });
    }
    else {
        return res.status(401).json({
            message: 'UNAUTHORIZED TO DELETE USER'
        })
    }
}

followUser = async (req, res) => {
    followerID = req.body.follower;
    followedID = req.body.followed;
    console.log("FOLLOWER:\t"+followerID+"\nFOLLOWED:\t"+followedID);
    if(1){//req.user.id == followerID){ //authorize
        
        //update follower's following list
        User.findByIdAndUpdate(followerID, { $push: {following : followedID }})
        .catch(err => {
            console.log(err);
            return res.status(500);
        });
        
        //update followed's followers list
        User.findByIdAndUpdate(followedID, { $push: {followers : followerID }})
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
    unfollowerID = req.params.unfollower;
    unfollowedID = req.params.unfollowed;
    if(req.user.id == unfollowerID){
    User.findByIdAndUpdate(unfollowerID, { $pull: {following: unfollowedID}});
    User.findByIdAndUpdate(unfollowedID, { $pull: {followers: unfollowerID}});
    }
}

updateUser = async (req, res) => {
    userID = req.params.id;
    if(req.user.id == userID){
    User.findByIdAndUpdate(userID, {
        username: req.body.username,
        profile_pic_url: req.body.profile_pic_url,
        bio: req.body.bio
    });}
}

updateBookmarks = async (req, res) => {
    userID = req.params.id;
    if(req.user.id == userID){
        User.findByIdAndUpdate(userID, {
            $push: { bookmarks: req.body.bookmark }
        });
    }
}

module.exports = {
    isLoggedIn,
    getUserInfo,
    deleteUser,
    followUser,
    unfollowUser,
    updateUser,
    updateBookmarks
}