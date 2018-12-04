const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('../models/users');
const User = mongoose.model('users');
const config = require('../config/database');



/* done is a callback */
module.exports = function (passport) {

  passport.use('user-local', new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {

    //Match User
    User.findOne({
      email: email
    }).then(user => {
      if (!user) {
        console.log(email);
        return done(null, false, {
          message: 'No User Found'
        });
      }

      //Match Password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          done(null, user);
        } else {
          done(null, false, {
            message: 'Password do not Match'
          });
        }

      });
    })
  }));

  passport.use('my-jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
  }, (jwt_payload, done) => {
    console.log('PayLoad: ', jwt_payload);
    User.getUserById(jwt_payload._id, (err, user) => {
      if (err) {
        return done(err, false);
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }

    });
  }));


  /*
     In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request.
     If authentication succeeds, a session will be established and maintained via a cookie set in user's browser.
     Each subsequent request will not contain credentials,
     but rather the unique cookie that identifies the session.
     In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
  */
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

}
