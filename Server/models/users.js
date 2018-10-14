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

mongoose.model('users', UserSchema);
