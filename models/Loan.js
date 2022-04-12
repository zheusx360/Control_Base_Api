const mongoose = require('mongoose')

const Loan = mongoose.model('Loan',{
   user: String,
   patrimonio: String,
   monitorId: String,
   serviceTag:String,
   microId:String,
   date: String,
   loanBy: String
})

module.exports = Loan