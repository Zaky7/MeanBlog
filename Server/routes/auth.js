const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');

require('../models/user');
const User = mongoose.model('user');


/* Post Login */
router.post('/login', function (req, res, next) {

  passport.authenticate('local', {
      session: false
    }, (err, user, info) => {
      console.log(err);
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user: user
        });
      }

      req.login(user, {
        session: false
      }, (err) => {
        if (err) {
          res.send(err);
        }
        // token expires in one week

        const token = jwt.sign(user, 'af33erdasec', {
          expiresIn: 604800
        });
        return res.json({
          user,
          token
        });
      });
    })
    (req, res);

});


function validateRequest(reqObject) {
  if (reqObject.username !== undefined && reqObject.password !== undefined && reqObject.email !== undefined) {
    return {
      username: reqObject.username,
      password: reqObject.password,
      email: reqObject.email
    }
  }
  return null;
}


router.post('/signin', async (req, res) => {
  const user = validateRequest(req.body);

  const newUser = new User({
    username: user.username,
    email: user.email,
    password: user.password
  });

  try {
    let userFromDb = await User.findOne({
      email: newUser.email
    });
    try {
      if (userFromDb === null) {
        userFromDb = await newUser.save();
        res.json({
          info: "Success in Creating User",
          user: userFromDb
        });
      } else {
        res.json({
          info: "Email already exists",
          user: userFromDb
        });
      }

    } catch (error) {
      console.log('Error');
      res.send('Error in saving patient in record');
    }

  } catch (error) {
    console.log('Error');
    res.send('Error in saving patient in record');
  }
});





module.exports = router;
