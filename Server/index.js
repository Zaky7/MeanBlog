const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');
const bodyParser = require('body-parser');
const app = express();

require('./config/passport');


// <--- Body Parser MiddleWare -->
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/***************************************** EXTERNAL ROUTES  ************************************************/
const user = require('./routes/user');
const auth = require('./routes/auth');
const index = require('./routes/index');

app.use('/', index);
app.use('/auth', auth);
app.use('/user', passport.authenticate('jwt', {session: false}), user);
//app.use('/user', user);




mongoose.Promise = global.Promise;

mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).then(() => {
  console.log('Connected to Remote mlab Database:- ' + keys.mongoURI);
}).catch((err) => {
  console.log('Error connecting to remote mlab Database ' + err);
})


const port = process.env.PORT || 5800;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
