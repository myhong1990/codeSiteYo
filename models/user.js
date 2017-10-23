const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  name:{
    type: String,
    required: true,
    default : '', 
    trim : true
  },
  email:{
    type: String,
    required: true,
    default : '', 
    trim : true
  },
  username:{
    type: String,
    required: true,
    default : '', 
    trim : true
  },
  password:{
    type: String,
    required: true,
    default : '', 
    trim : true
  }
})

const User = module.exports = mongoose.model('User', UserSchema);
