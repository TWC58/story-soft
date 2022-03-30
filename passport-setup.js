const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = process.env.OAUTH_CLIENT_ID || "540240407763-v90k1276kl5v93s6hu5jfc8n42vk1c5b.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || "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";
const GOOGLE_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL || "http://localhost:8080/auth/google/callback";

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    //implement with db check
    //User.findById(id, function(err, user) {
        done(null, user);
    //});
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true
    //https://story-soft.herokuapp.com/auth/google/callback
  },
  function(request, accessToken, refreshToken, profile, done) {
    //use profile info to check if user is registered in DB (id/email)
    err = null;
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, profile);
    //);
  }
));