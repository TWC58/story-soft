const { ObjectID } = require('bson');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('./models/user-model')

const GOOGLE_CLIENT_ID = process.env.OAUTH_CLIENT_ID || "540240407763-v90k1276kl5v93s6hu5jfc8n42vk1c5b.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || "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";
const GOOGLE_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL || "http://localhost:5000/auth/google/callback";

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    //use profile info to check if user is registered in DB (id/email)
    User.findOne({ email: profile.email }, function (err, user) {
      //console.log(user.email); //causes error on new user
      if(err) { //if error
          return done(err);
      }
      if(!user) { //if no user yet
          user = new User({
            _id: new ObjectID(),
            username: "User"+profile.id,
            email: profile.email,
            bio: "",
            likes: [],
            dislikes: [],
            followers: [],
            following: [],
            bookmarks: []
          })
          user.save(function(err, results) {
              if(err) { return done(err); }
              else { return done(err, user); }
          });
      }
      else { //success
          return done(err, user);
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});