const mongoose = require('mongoose')

const Loan = mongoose.model('Rent',{
   user: String,
   serviceTag:String,
   patrimonio: String,
   date: String,
})

module.exports = Loan