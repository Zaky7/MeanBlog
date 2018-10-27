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

      const token = jwt.sign(newUserInDb.toJSON() ,config.secret,{
        expiresIn:604800 // 1 week
       });

      let resUser =  {
        id: newUserInDb._id,
        name: newUserInDb.name,
        username: newUserInDb.username,
        email : newUserInDb.email
      };
      resultJson.user = resUser;
      resultJson.info = "User successfully saved";
      resultJson.success = true;
      res.json(resultJson);
    } catch (error) {
      console.trace(`Error saving new User`);
      resultJson.info = "Error in saving user";
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
      email : userInDb.email
    };

    const token = jwt.sign(userInDb.toJSON() ,config.secret,{
      expiresIn:604800 // 1 week
     });

    resultJson.user = resUser;
    resultJson.info = 'Email Id already Exist in the database';
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
    const username = userObject.username;
    const password = userObject.password;
    User.getUserByUsername(username, (err,user) => {
      if(err){
         throw err;
      }

      if(!user){
         return res.json({success:false, msg:'User not found'});
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                   const token = jwt.sign(user ,config.secret,{
                         expiresIn:604800 // 1 week
                   });

                  //(MAKE SURE TO PUT A SPACE AFTER "Bearer"!!!!)
                  res.json({
                      success: true,
                      token: 'Bearer '+ token,
                      user : {
                         id: user._id,
                         name: user.name,
                         username: user.username,
                         email : user.email
                      }
                  });
          } else {
             return res.json({success:false, msg:'Wrong password'});
          }
      });
  });
   } else {
    res.json({
      success: false,
      errors: errors
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


router.get('/profile', passport.authenticate('jwt',{session:false}), (req,res,next) => {
  res.json({user:req.user});
});

router.get("/secretDebug", (req, res, next) => {
    console.log(req.get('Authorization'));
    next();
  }, (req, res) => {
    res.json("debugging");
});

module.exports = router;
