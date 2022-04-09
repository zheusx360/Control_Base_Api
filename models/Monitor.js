const mongoose = require('mongoose')

const Monitor = mongoose.model('Monitor',{
   patrimonio: String,
   marca:String,
   model: String,
   status: Object
})

module.exports = Monitor