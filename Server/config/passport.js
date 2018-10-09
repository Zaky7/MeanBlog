const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


require('../models/user');
const UserModel = mongoose.model('user');



passport.use(
  new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, cb) {
      return UserModel.findOne({ email, password }).lean()
        .then(user => {
          if (!user) {
            return cb(null, false, { message: 'Incorret Email or Password' });
          }

          return cb(null, user, { message: 'Logged in SuccessFully' });
        }).catch(err => cb(err));
    }
));


passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'af33erdasec'
    },
    function (jwtPayload, cb) {

        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return UserModel.findById(jwtPayload._id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));
