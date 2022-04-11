const mongoose = require('mongoose')

const Loan = mongoose.model('Rent',{
   user: String,
   patrimonio: String,
   monitorId: String,
   serviceTag:String,
   microId:String,
   date: String,
})

module.exports = Loan