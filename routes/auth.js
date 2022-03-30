const express = require("express");
const router = express.Router();
const passport = require('passport');
require('../passport-setup');
const User = require('../controllers/user-controller');

//redirect uri after google failure (placeholder for now)
router.get("/failed", (req, res) => {
    res.json("login failed") 
});

router.get("/good", User.isLoggedIn, (req, res) => {
    res.send(`GMAIL: ${req.user.email}`)
});

//brings user to google sign in pa
router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

//callback uri
router.get('/google/callback', 
  passport.authenticate('google')
);

//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('../');
});

//get user profile info
router.get('/getUser/:id', (req, res) => {
    getUser(req, res);
});

module.exports = router;