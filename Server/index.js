const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');


const app = express();

/***************************************** EXTERNAL ROUTES  ************************************************/
const user = require('./routes/user');
app.use('/user', user);


mongoose.Promise = global.Promise;

mongoose.connect(keys.mongoURI).then(() => {
  console.log('Connected to Remote mlab Database:- ' + keys.mongoURI);
}).catch((err) => {
  console.log('Error connecting to remote mlab Database ' + err);
})


const port = process.env.PORT || 5700;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
