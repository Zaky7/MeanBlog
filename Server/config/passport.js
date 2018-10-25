const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const passport = require('passport');

//Loding the user Modal
const User = mongoose.model('users');
/* done is a callback */
module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField:'email'}, (email,password,done) =>{

    //Match User
     User.findOne({
       email:email
     }).then( user => {
         if(!user){
            console.log(email);
            return done(null,false,{message:'No User Found'});
         }

         //Match Password
         bcrypt.compare(password,user.password, (err,isMatch)=>{
           if(err) throw err;

           if(isMatch){
             done(null,user);
           }else{
             done(null,false,{message:'Password do not Match'});
           }

         });
     })
  }));

 /*
    In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request.
    If authentication succeeds, a session will be established and maintained via a cookie set in user's browser.
    Each subsequent request will not contain credentials,
    but rather the unique cookie that identifies the session.
    In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
 */
  passport.serializeUser(function(user, done) {
   done(null, user.id);
 });

 passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
     done(err, user);
   });
 });
}
