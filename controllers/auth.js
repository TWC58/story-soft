const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../controllers/user-controller');

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
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  //res.redirect('http://localhost:3000');
});

router.get('/getLoggedIn', User.isLoggedIn, (req, res) => {
  res.json(req.user);
}); //TODO needed?

//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('../');
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