const mongoose = require('mongoose')

const UserSystem = mongoose.model('UserSystem',{
   email: String,
   name: String,
   password: String,
   type: String,
   approved: Boolean
})

module.exports = UserSystem