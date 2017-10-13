const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

/**
 * Load the Register Form
 */
router.get('/backend/java', function(req, res){
  res.render('ui/software/backend/java');
});

module.exports = router;