const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../schemas/user.schema');
const oAuthTokens = require('./oauthTokens.js');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      process.nextTick(() => {
        User.findOne({'email': email}, (err, user) => {

          if (err)
            return done(err);
          if (user) {
            return done(new Error('User already exits'));
          } else {

            const newUser = new User();
            newUser.email = req.body.email;
            newUser.password = newUser.generateHash(req.body.password);
            newUser.name = req.body.name;
            newUser.save((err) => {
              if (err)
                return done(err);
              return done(null, newUser);
            });
          }
        });
      });
    }));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne({'email': email}, (err, user) => {
        if (err)
          return done(err);
        if (!user) {
          return done(null, false, new Error('User doesn\'t exists'));
        }
        if (!user.validPassword(password)) {
          return done(null, false, new Error('Invalid Password.'));
        } else {
          return done(null, user);
        }
      });
    }));

  passport.use('google', new GoogleStrategy({
      clientID: oAuthTokens.googleAuth.clientID,
      clientSecret: oAuthTokens.googleAuth.clientSecret,
      callbackURL: oAuthTokens.googleAuth.callbackURL,
    },
    function (token, refreshToken, profile, done) {
      process.nextTick(() => {
        User.findOne({'google.id': profile.id}, (err, user) => {
          if (err)
            return done(err);
          if (user) {
            return done(null, user);
          } else {
            const newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;
            newUser.save((err) => {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));
};