const mongoose = require('mongoose')

const Loan = mongoose.model('Loan',{
   user: String,
   userName: String,
   date: String,
   loanBy: String,
   microId:String,
   serviceTag:String,
   modelPc: String,
   memory:String,
   patrimonioPc: String,
   patrimonio: String,
   monitorId: String,
   modelMonitor: String,
   marcaMonitor: String,
   status: String,
})

module.exports = Loan