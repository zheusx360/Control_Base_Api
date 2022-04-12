const router = require('express').Router() 
const Monitor = require('../models/Monitor')
const verifyJwt = require('../helpers/verify-jwt')

//Inserção de um novo Micro na Base de Dados
router.post('/',verifyJwt, async (req, res) => {
   const {patrimonio,marca, model, status} = req.body 
   const monitor = {
      patrimonio,
      marca,
      model,
      status: status || 'available'
   }
   verifyMonitor = await Monitor.findOne({patrimonio:monitor.patrimonio})

   if(verifyMonitor){
      res.status(422).json({message:`Monitor com o patrimonio ${monitor.patrimonio} já está cadastrado no sistema!`})
      return
   }

   if(!patrimonio || !marca || !model ){
      res.status(422).json({message:'Error - dados inválidos, todos os campos são obrigatórios!'})
      return
   }
   try {
      //Criando os dados do Monitor
      await Monitor.create(monitor)
      res.status(201).json({message: 'Monitor adicionado com sucesso!'})

   } catch (error) {
      res.status(500).json({error: error})
   }
})

//Busca de todos os Monitores na base de dados
router.get('/',verifyJwt, async (req,res) =>{

   try {

      const monitores = await Monitor.find()
      res.status(200).json(monitores)
      
   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Busca de todos os Monitores não alugados na base de dados
router.get('/available',verifyJwt, async (req,res) =>{

   try {

      const monitores = await Monitor.find({ status: 'available'} )
      res.status(200).json(monitores)
      
   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Busca de um Monitor especifico na base de dados
router.get('/:id',verifyJwt, async (req, res) => {
   const id = req.params.id
   try {
      const monitor = await Monitor.findOne({patrimonio: id})
      if(!monitor){
         res.status(422).json({message: "Monitor não encontrado!"})
         return
      }
      res.status(200).json(monitor)

   } catch (error) {
      res.status(500).json({error: error})
   }
})

//Atualização de dados do Micro (Update)
router.patch('/:id',verifyJwt, async (req, res) => {

   const id = req.params.id
   const {patrimonio,marca, model, status, loanby, loanFor} = req.body 
   const monitor = {
      patrimonio,
      marca,
      model,
      status: status || 'available',
      loanBy: loanby || 'NA',
      loanFor: loanFor || 'NA'
   }
   try {  
      const updateMonitor = await Monitor.updateOne({patrimonio: id}, monitor)
      if(updateMonitor.matchedCount === 0){
         res.status(422).json({message: 'Monitor não encontrado na base de dados!'})
         return
      }
      res.status(200).json(monitor)

   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Deletar um Monitor
router.delete('/:id',verifyJwt, async(req, res) =>{

   const id = req.params.id
   const monitor = await Monitor.findOne({patrimonio: id})
   if(!monitor){
      res.status(422).json({message:'O Monitor não foi encontrado!'})
      return
   }
   try {

      await Monitor.deleteOne({patrimonio: id})
      res.status(200).json({message:"Monitor deletado com sucesso!"})
      
   } catch (error) {
      res.status(500).json({error: error})
   }
})



module.exports = router