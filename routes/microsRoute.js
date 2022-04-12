const router = require('express').Router() 
const Micros = require('../models/Micros')
const verifyJwt = require('../helpers/verify-jwt')

//Inserção de um novo Micro na Base de Dados
router.post('/',verifyJwt, async (req, res) => {
   const {serviceTag, model, memoria , patrimonio, status} = req.body 
   const micro = {
      serviceTag,
      model,
      memoria,
      patrimonio,
      status: status || 'available'
   }
   verifyMicro = await Micros.findOne({serviceTag:micro.serviceTag})

   if(verifyMicro){
      res.status(422).json({message:`Micro com a service tag ${micro.serviceTag} já cadastrado no sistema!`})
      return
   }



   if(!serviceTag || !model || !memoria || !patrimonio ){
      res.status(422).json({message:'Error - dados inválidos, todos os campos são obrigatórios!'})
      return
   }
   try {
      //Criando os dados do usuário
      await Micros.create(micro)
      res.status(201).json({message: 'Micro asdicionado com sucesso!'})

   } catch (error) {
      res.status(500).json({error: error})
   }
})

//Busca de todos os Micros na base de dados
router.get('/',verifyJwt, async (req,res) =>{

   try {

      const micros = await Micros.find()
      res.status(200).json(micros)
      
   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Busca de todos os Micros não alugados na base de dados
router.get('/available',verifyJwt, async (req,res) =>{

   try {

      const micros = await Micros.find({ status: 'available'} )
      res.status(200).json(micros)
      
   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Busca de um Micro especifico na base de dados
router.get('/:id',verifyJwt, async (req, res) => {
   const id = req.params.id
   try {
      const micro = await Micros.findOne({serviceTag: id})
      if(!micro){
         res.status(422).json({message: "Micro não encontrado!"})
         return
      }
      res.status(200).json(micro)

   } catch (error) {
      res.status(500).json({error: error})
   }
})

//Atualização de dados do Micro (Update)
router.patch('/:id',verifyJwt, async (req, res) => {

   const id = req.params.id
   const {serviceTag, model, memoria , patrimonio, status,loanby, loanFor} = req.body 
   const micro = {
      serviceTag,
      model,
      memoria,
      patrimonio,
      status: status || 'available',
      loanBy: loanby || 'NA',
      loanFor: loanFor || 'NA'
   }
   try {  
      const updateMicro = await Micros.updateOne({serviceTag: id}, micro)
      if(updateMicro.matchedCount === 0){
         res.status(422).json({message: 'Micro não encontrado na base de dados!'})
         return
      }
      res.status(200).json(micro)

   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Deletar um Micro
router.delete('/:id',verifyJwt, async(req, res) =>{

   const id = req.params.id
   const micro = await Micros.findOne({serviceTag: id})
   if(!micro){
      res.status(422).json({message:'O Micro não foi encontrado!'})
      return
   }
   try {

      await Micros.deleteOne({serviceTag: id})
      res.status(200).json({message:"Micro deletado com sucesso!"})
      
   } catch (error) {
      res.status(500).json({error: error})
   }
})



module.exports = router