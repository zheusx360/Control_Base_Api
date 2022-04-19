const mongoose = require('mongoose')

const SaveCodeAndEmail = mongoose.model('CodeEmail',{
   code: String,
   email: String,
})

module.exports = SaveCodeAndEmail