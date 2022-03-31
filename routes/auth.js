const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require('../controllers/user-controller');

//redirect uri after google failure (placeholder for now)
router.get("/failed", (req, res) => {
    res.json("login failed") 
});

router.get("/good", User.isLoggedIn, (req, res) => {
    res.send(`GMAIL: ${req.user.email}`);
});

//brings user to google sign in pa
router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

//callback uri
router.get('/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/auth/good',
    failureRedirect: '/auth/failed'
  })
);

//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('../');
});

//get user profile info
router.get('/getUser/:id', User.getUser);

router.delete('/deleteUser', User.isLoggedIn, User.deleteUser);

//router.put('/followUser/:follower/:followed', User.isLoggedIn, User.followUser);

//invalid request
router.get('*', (req, res) => {
  res.sendStatus(400);
});

module.exports = router;