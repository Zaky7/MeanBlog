const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Keys = require('./config/database');
const passport = require('passport');

const app = express();
const PORT = 5350;

mongoose.connect(Keys.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => console.log(`MongoDb Connected ${Keys.mongoURI}`))
  .catch(err => console.log(err));

mongoose.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!");
  return console.log(err);
});


// CORS middleWare
app.use(cors());


// Passport Middle Ware

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//BodyParser MiddleWare
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());



//Routes
const userRoute = require('./routes/user');
app.use('/user', userRoute);



const server = app.listen(PORT, () => {
  const port = server.address().port;
  console.log(`Server is running at http://localhost:${port}`);
});
