const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
//Load Server Model
require('../models/users');
const User = mongoose.model('users');



function validateRequest(reqObject) {
   let errors = [];
   if(reqObject.email == undefined || reqObject.email == "") {
     errors.push('No email id specified');
   }

   if(reqObject.username == undefined || reqObject.username == "") {
     errors.push('No valid username specified');
   }

   if(reqObject.password == undefined || reqObject.password == "") {
      if(reqObject.password.length < 8) {
          errors.push('Password length less than 8 characters');
      } else {
         errors.push('Not a valid password specified');
      }
   }
   return errors;
}

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  })

  console.log(`Hashed Password ${hashedPassword}`);
  return hashedPassword
}

async function addUserInDb(newUser, res) {
  const userInDb = await User.findOne({ email: newUser.email});

  let resultJson = {
     user: '',
     info: ''
  };

  if (!userInDb) {
    try {
      newUser.password = await hashPassword(newUser.password);
      const newUserInDb = await newUser.save();
      resultJson.user = newUserInDb;
      resultJson.info = "User successfully saved";
      res.json(resultJson);
    } catch (error) {
      console.trace(`Error saving new User`);
      resultJson.info = "Error in saving user";
      resultJson.user = null;
      res.json(resultJson);
    }
  } else {
    resultJson.user = userInDb;
    resultJson.info = 'Email Id already Exist in the database'
    res.json(resultJson);
  }
}


router.post('/login', (req,res,next) => {

   passport.authenticate('local', (err, passportUser) => {
       return res.json({
         user: passportUser
       });
   })

});


router.post('/register', (req, res) => {
  console.log(req.body);


  if(req.body.user == undefined) {
     res.json('No user credentails specified');
  }

  // Returns an error array which if empty shows credentials are valid
  let errors = validateRequest(req.body.user);

	if(errors.length == 0) {
    const user = req.body.user;
    const userModel = new User({
		    username: user.username,
		    email: user.email,
		    password: user.password
  	});
    addUserInDb(userModel, res);
  } else {
		res.json({
      errors: errors
    });
	}

});


module.exports = router;
