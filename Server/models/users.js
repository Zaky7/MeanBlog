const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
	User.findOne(query,callback);
}
