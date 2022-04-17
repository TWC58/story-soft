const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../controllers/user-controller');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

//redirect uri after google failure (placeholder for now)
router.get("/failed", (req, res) => {
    res.json("login failed") 
});

router.get("/good", User.isLoggedIn, (req, res) => {
    res.send("LOGGED IN");//(`GMAIL: ${req.user.email}\nID: ${req.user.id}`);
});

//brings user to google sign in pa
router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

//callback uri
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: `${FRONTEND_URL}/login/success`,
  failureRedirect: `${FRONTEND_URL}/login/failure`
}),  
  (req, res) => {
    console.log("User: ", req.user);
    //res.status(200).json(req.user);
});

router.get('/getLoggedIn', User.isLoggedIn, User.getLoggedIn); //TODO needed?

//logout
router.post('/logout', (req, res) => {
    console.log('Logging out...');
    req.logout();
    console.log(req.user);
    res.status(200).send();
});

//get user profile info
router.get('/getUser/:id', User.getUserInfo);

router.delete('/deleteUser/:id', User.isLoggedIn, User.deleteUser);

router.get('/deleteUser/:id', User.isLoggedIn, User.deleteUser);

router.post('/followUser', User.isLoggedIn, User.followUser);

router.post('/unfollowUser', User.isLoggedIn, User.unfollowUser);

router.post('/updateUser', User.isLoggedIn, User.updateUser);

router.post('/updateBookmarks', User.isLoggedIn, User.updateBookmarks);

//invalid request
router.get('*', (req, res) => { //TODO get rid of
  console.log("WILDCARD");
  res.sendStatus(400);
});

module.exports = router;