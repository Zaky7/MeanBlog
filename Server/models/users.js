const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt   = require('bcryptjs');


const UserSchema = new Schema({
  jwtToken: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});



const User = module.exports = mongoose.model('users', UserSchema);



//Function for calling respective Users by Id
module.exports.getUserById =  function(id,callback) {
	User.findById(id,callback);
}

//Function for calling respective Users by Username
module.exports.getUserByUsername = function(username,callback){
	const query = {username: username}
	User.findOne(query,callback).lean();
}



module.exports.comparePassword = function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword,hash,(err,isMatch) => {
      if(err) throw err;
      callback(null,isMatch);
  });
}


module.exports.addUser = function(newUser, callback){
bcrypt.genSalt(10,(err,salt) => {
     bcrypt.hash(newUser.password, salt, (err,hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save(callback);
     });
});
}
