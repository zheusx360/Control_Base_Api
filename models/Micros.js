const mongoose = require('mongoose')

const Micros = mongoose.model('Micros',{
   serviceTag:String,
   model: String,
   memoria:String,
   patrimonio: String,
   status: Object,
   loanBy: String,
   loanFor: String
})

module.exports = Micros