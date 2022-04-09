const router = require('express').Router() 
const User = require('../models/User')
const verifyJwt = require('../helpers/verify-jwt')

//Inserção de um novo usuário na Base de Dados
router.post('/',verifyJwt, async (req, res) => {
   const {name, registration, sector , loan} = req.body 
   const user = {
      name,
      registration,
      sector,
      loan
   }
   verifyUser = await User.findOne({registration:user.registration})

   if(verifyUser){
      res.status(422).json({message:`Usuário com a matricula ${user.registration} já cadastrado no sistema!`})
      return
   }

   if(!name || !registration ){
      res.status(422).json({message:'Error - dados inválidos, nome e matrícula obrigatórios!'})
      return
   }
   try {
      //Criando os dados do usuário
      await User.create(user)
      res.status(201).json({message: 'Usuário criado com sucesso!'})

   } catch (error) {
      res.status(500).json({error: error})
   }
})

//Busca de todos os usuários na base de dados
router.get('/',verifyJwt, async (req,res) =>{

   try {

      const users = await User.find()
      res.status(200).json(users)
      
   } catch (error) {
      res.status(500).json({error: error})
   }

})
//Busca de um usúario especifico na base de dados
router.get('/:id',verifyJwt, async (req, res) => {
   const id = req.params.id
   try {
      const user = await User.findOne({registration: id})
      if(!user){
         res.status(422).json({message: "Usuário não encontrado!"})
         return
      }
      res.status(200).json(user)

   } catch (error) {
      res.status(500).json({error: error})
   }
})
//Atualização de dados (Update)
router.patch('/:id',verifyJwt, async (req, res) => {

   const id = req.params.id
   const {name, registration, sector , loan} = req.body
   const user = {
      name,
      registration,
      sector,
      loan
   }
   try {  
      const updateUser = await User.updateOne({registration: id}, user)
      if(updateUser.matchedCount === 0){
         res.status(422).json({message: 'Usuário não encontrado na base de dados!'})
         return
      }
      res.status(200).json(user)

   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Deletar dados
router.delete('/:id',verifyJwt, async(req, res) =>{

   const id = req.params.id
   const user = await User.findOne({registration: id})
   if(!user){
      res.status(422).json({message:'O usuário não foi encontrado!'})
      return
   }
   try {

      await User.deleteOne({registration: id})
      res.status(200).json({message:"Usuário deletado com sucesso!"})
      
   } catch (error) {
      res.status(500).json({error: error})
   }
})



module.exports = router