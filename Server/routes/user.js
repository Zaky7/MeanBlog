const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//Load Server Model
require('../models/users');
const User = mongoose.model('users');



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


function addNewUser(newUser, res) {

	User.findOne({
      email: newUser.email
    }).lean().then(user => {

      const token = jwt.sign(user, 'af33erdasec', {
            expiresIn: 604800
      });

      user.token = token;

    	if(user == null) {
        newUser.save().then(user => {
    			res.json({
    				info: "User successfully saved",
    				user: user
    			});

    		}).catch(err => res.json({info: "Error in saving user"}))
    	} else {
    		res.json({
    			info: "User with given email already present",
    			user: user
    		});
    	}
    }).catch( err => {
    	console.log(`${err}`);
      res.send(`{"info": "Error in saving user ${err}"}`);
    });

}



router.post('/login', (req,res,next) => {



});


router.post('/signup', (req, res) => {

	console.log(req.body);
	const user = validateRequest(req.body.user);

	if(user != null) {
		const newUser = new User({
		    username: user.username,

		    email: user.email,
		    password: user.password
  		});
		addNewUser(newUser, res);
	} else {
		res.send('{"info": "Error in saving user all input fields not present"}');
	}

});


module.exports = router;