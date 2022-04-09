require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

//configurações necessarias para leitura do json
app.use(
   express.urlencoded({
      extended:true,
   })
)

app.use(express.json())

//Rotas da API
const userRoutes = require('./routes/userRoutes')
const userSystemRoutes = require('./routes/userSystemRoutes')
const microsRoutes = require('./routes/microsRoute')
const monitorRoutes = require('./routes/monitorRoute')
const loanRoutes = require('./routes/loanRoute')

app.use('/user', userRoutes)
app.use('/user-system', userSystemRoutes)
app.use('/micros', microsRoutes)
app.use('/monitor', monitorRoutes)
app.use('/loan', loanRoutes)

//rota inicial do endpoint
app.get('/', (req, res) => {
   res.json({ message: 'Oi Express'})
})

//Parte da conexão com o banco de dados
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
console.log(DB_USER,process.env.DB_USER)
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@apimicro.ntceg.mongodb.net/apicadastromicro?retryWrites=true&w=majority`)
.then( () => {
   console.log('Conectado ao mongoDB')
}
)
.catch((erro) => console.log("Erro ao conectar: ",erro))
//mongodb+srv://apiCadastroMicro:RDQaHO8xdVzmVmhe<password>@apimicro.ntceg.mongodb.net/apicadastromicro?retryWrites=true&w=majority
//RDQaHO8xdVzmVmhe

module.exports = app