const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
  res.send('User jwt success');
});

/* GET user profile. */
router.get('/profile', function(req, res, next) {
    res.send(req.user);
});

router.post('/create', (req,res) => {
   const email = req.body.email;
   const pass  = req.body.pass;
   const username = req.body.username;
});

module.exports = router;
