const mongoose = require('mongoose')

const User = mongoose.model('User',{
   name: String,
   registration: String,
   sector: String,
   loan: Array
})

module.exports = User