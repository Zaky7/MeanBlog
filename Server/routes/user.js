const express = require('express');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const config = require('../config/database');
//Load Server Model
require('../models/users');
const User = mongoose.model('users');
const auth = require('./testjwt');



function validateRequest(reqObject) {
   let errors = [];
   if(reqObject.email == undefined || reqObject.email == "") {
     errors.push('No email id specified');
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

// Generate HashPassword
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
     user: ''
  };

  if (!userInDb) {
    try {
      newUser.password = await hashPassword(newUser.password);
      const newUserInDb = await newUser.save();

      const token = jwt.sign(newUserInDb.toJSON() ,config.secret,{
        expiresIn:604800 // 1 week
      });

      let resUser =  {
        id: newUserInDb._id,
        name: newUserInDb.name,
        username: newUserInDb.username,
        email : newUserInDb.email,
        dateCreated: newUserInDb.dateCreated
      };
      resultJson.user = resUser;
      resultJson.token = token;
      resultJson.msg = "User successfully saved";
      resultJson.success = true;
      res.json(resultJson);
    } catch (error) {
      console.trace(`Error saving new User`);
      resultJson.msg = "Error in saving user";
      resultJson.user = null;
      resultJson.success = false;
      resultJson.token = "";
      res.json(resultJson);
    }
  } else {
    let resUser =  {
      id: userInDb._id,
      name: userInDb.name,
      username: userInDb.username,
      email : userInDb.email,
      dateCreated: userInDb.dateCreated
    };

    const token = jwt.sign(userInDb.toJSON() ,config.secret,{
      expiresIn:604800 // 1 week
     });

    resultJson.user = resUser;
    resultJson.msg = 'Email Id already Exist in the database';
    resultJson.success = true;
    resultJson.token = token;
    res.json(resultJson);
  }
}


router.post('/login', (req,res,next) => {

   // Returns an error array which if empty shows credentials are valid
   const userObject = req.body.user;
   let errors = validateRequest(userObject);

   if(errors.length == 0 && userObject !== undefined) {
    const email = userObject.email;
    const password = userObject.password;
    User.getUserByEmail(email, (err,user) => {
      if(err){
         throw err;
      }

      if(!user){
         return res.json({success:false, msg:'User not found'});
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                   const token = jwt.sign(user.toJSON() ,config.secret,{
                         expiresIn:604800 // 1 week
                   });

                  //(MAKE SURE TO PUT A SPACE AFTER "Bearer"!!!!)
                  res.json({
                      user : {
                         id: user._id,
                         name: user.name,
                         username: user.username,
                         email : user.email
                      },
                      token: 'Bearer '+ token,
                      success: true,
                  });
          } else {
             return res.json({
               user: null,
               token: null,
               msg:'Wrong password',
               success:false,
              });
          }
      });
  });
   } else {
    res.json({
      user: null,
      token: null,
      errors: errors,
      success: false,
      msg: "User not found"
    });
   }
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
      success: false,
      errors: errors
    });
	}

});


router.get('/profile', passport.authenticate('my-jwt'), (req,res,next) => {
  console.log(req.get('Authorization'));
  res.json({user:req.user});
});

router.get("/secretDebug", auth , (req, res) => {
    res.json("debugging");
});

module.exports = router;
