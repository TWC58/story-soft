const { ObjectID } = require('bson');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user-model')

const GOOGLE_CLIENT_ID = process.env.OAUTH_CLIENT_ID || "540240407763-v90k1276kl5v93s6hu5jfc8n42vk1c5b.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || "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";
const GOOGLE_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL || "http://localhost:5000/auth";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  })
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  (request, accessToken, refreshToken, profile, done) => {
    //use profile info to check if user is registered in DB (id/email)
    User.findOne({ googleId: profile.id }).then((err, currentUser) => {
     
      if(err) { //error occurred
        done(err);
      }

      else if(currentUser) { //user already exists
        //console.log('Current User: ', currentUser);
        done(null, currentUser);
      }

      else { //no user yet
          new User({
            _id: new ObjectID(),
            googleId: profile.id,
            username: "User"+profile.id,
            email: profile.email,
            profile_pic_url: "",
            bio: "",
            likes: [],
            dislikes: [],
            followers: [],
            following: [],
            bookmarks: []
          }).save().then((newUser) => {
              //console.log('New User: ', newUser);
              done(null, newUser);
          });
      }
    });
  }
));