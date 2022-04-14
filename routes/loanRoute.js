const router = require('express').Router() 
const Loan = require('../models/Loan')
const User = require('../models/User')
const verifyJwt = require('../helpers/verify-jwt')

//Inserção de um novo empréstimo na Base de Dados
router.post('/',verifyJwt, async (req, res) => {
   const {user, userName, date, loanBy, microId, serviceTag, modelPc, memory, patrimonioPc, patrimonio, monitorId, modelMonitor  } = req.body 
   const loan = {
      user: user,
      userName: userName,
      date: date || "NA",
      loanBy: loanBy || "NA",
      microId:microId || "NA",
      serviceTag:serviceTag || "NA",
      modelPc: modelPc || "NA",
      memory: memory || "NA",
      patrimonioPc: patrimonioPc,
      patrimonio: patrimonio,
      monitorId: monitorId || "NA",
      modelMonitor: modelMonitor || "NA",
   }

   if(!user || !date && !serviceTag || !patrimonio  ){
      res.status(422).json({message:'Error - dados inválidos, todos os campos são obrigatórios!'})
      return
   }
   try {
      //Criando os dados do empréstimo
      let loanCreate = await Loan.create(loan)
      await User.updateOne({registration: user}, {$push : {"loan" : JSON.stringify(loanCreate._id)}})
      res.status(201).json({message: 'Empréstimo realizado!', loan:  loanCreate._id})

   } catch (error) {
      res.status(500).json({error: error})
   }

   

})


//Busca de todos os empréstimo na base de dados 
router.get('/',verifyJwt, async (req,res) =>{

   try {

      const loan = await Loan.find()
      res.status(200).json(loan)
      
   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Busca de um empréstimo especifico na base de dados  Por usuário, serviceTag ou patrimonio
router.get('/:id',verifyJwt, async (req, res) => {
   const id = req.params.id
   try {
      const loan = await Loan.find({$or: [{user: id},{serviceTag: id},{patrimonio: id}]})
      if(!loan){
         res.status(422).json({message: "Empréstimo não encontrado!"})
         return
      }
      res.status(200).json(loan)

   } catch (error) {
      res.status(500).json({error: error})
   }
})

//Atualização de dados (Update)
router.patch('/:id',verifyJwt, async (req, res) => {

   const id = req.params.id
   const {user, serviceTag, patrimonio,date } = req.body 
   const loan = {
      user: user,
      serviceTag:serviceTag,
      patrimonio: patrimonio,
      date: date
   }
   try {  
      const updateLoan = await Loan.updateOne({_id: id}, loan)
      if(updateLoan.matchedCount === 0){
         res.status(422).json({message: 'Empréstimo não encontrado na base de dados!'})
         return
      }
      res.status(200).json(loan)

   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Deletar empréstimo por _id
router.delete('/:id',verifyJwt, async(req, res) =>{

   const id = req.params.id
   const loan = await Loan.findOne({_id: id})
   if(!loan){
      res.status(422).json({message:'Empréstimo não foi encontrado!'})
      return
   }
   try {
      await Loan.deleteOne({_id: id})
      res.status(200).json({message:"Empréstimo deletado com sucesso!"})
      
   } catch (error) {
      res.status(500).json({error: error})
   }
})

module.exports = router