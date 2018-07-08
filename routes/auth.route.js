/**
 * Created by lcom59 on 3/21/2018.
 * It contain all the routes regarding the user authentication
 */

const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Authentication Route root.');
});

// local-sign up using passport
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: 'signup-success',
  failureRedirect: 'signup-failed?from=local',
}));

router.get('/signup-success', (req, res) => {
  res.json({'message': 'Successful'}).status(200);
});

router.get('/signup-failed', (req, res) => {
  res.json({'message': 'Failed'}).status(400);
});

// local-login using passport
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/signup-success',
  failureRedirect: '/signup-failed?from=local',
}));

// sign in using google+ using password
router.get('/google',
  passport.authenticate('google', {
      scope: [
        'profile',
        'email'
      ]
    }
  ));

router.get('/google/callback',
  passport.authenticate('google', {
      successRedirect: '/signup-success',
      failureRedirect: '/signup-failed?from=google'
  }));


module.exports = router;