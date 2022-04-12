const mongoose = require('mongoose')

const Monitor = mongoose.model('Monitor',{
   patrimonio: String,
   marca:String,
   model: String,
   status: Object,
   loanBy: String,
   loanFor: String
})

module.exports = Monitor