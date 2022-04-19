const router = require('express').Router() 
const UserSystem = require('../models/UserSystem')
const SaveCodeAndEmail = require('../models/SaveCodeAndEmail')
const createUserToken = require('../helpers/create-user-token')
const verifyJwt = require('../helpers/verify-jwt')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const CodeGenerator = require('../helpers/CodeGenerator')

//Inserção de um novo usuário na Base de Dados
router.post('/', async (req, res) => {
   const {email, name, password, type = 'user', approved = false } = req.body 

   if(!email || !name || !password ){
      res.status(422).json({message:'Error - dados inválidos, email, nome e senha obrigatórios!'})
      return
   }

   const passwordHash = await bcrypt.hash(password, 10);

   const user = {
      email,
      name,
      password: passwordHash,
      type,
      approved
   }

   verifyUser = await UserSystem.findOne({email:user.email})

   if(verifyUser){
      res.status(422).json({message:`Usuário com o email ${user.email} já cadastrado no sistema!`})
      return
   }

   verifyUser = await UserSystem.findOne({email:user.email})
   if(verifyUser){
      res.status(422).json({message:`Email ${user.email} já cadastrado no sistema!`})
      return
   }

   try {
      //Criando os dados do usuário
      await UserSystem.create(user)
      res.status(201).json({message: 'Usuário criado com sucesso!'})

   } catch (error) {
      res.status(500).json({error: error})
   }
})

//Busca de todos os usuários na base de dados (apenas usuários admin e super admin tem acesso)
router.get('/:id',verifyJwt, async (req,res) =>{

   const id = req.params.id
   const user = await UserSystem.findOne({email: id})

   try {
      const users = await UserSystem.find()
      if(users === null){
         res.status(422).json({message:'Nenhum usuário encontrado no sistema'})
         return
      }
      res.status(200).json(users)
      
   } catch (error) {
      res.status(500).json({error: error})
   }

})
//Busca de um usúario especifico na base de dados
router.get('/single/:id',verifyJwt, async (req,res) =>{

   const id = req.params.id

   try {
      const user = await UserSystem.findOne({email: id})
      if(user === null){
         res.status(422).json({message:'Nenhum usuário encontrado no sistema'})
         return
      }
      res.status(200).json(user)
      
   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Rota que traz todos os usuários que necessitam de aprovação
router.get('/approve/:id',verifyJwt, async (req,res) =>{

   const id = req.params.id
   const user = await UserSystem.findOne({email: id})

   try {
      if(user.type !== 'admin' && user.type !== 'super admin'){
         res.status(422).json({message:'Acesso restrito!'})
         return
      }
      const users = await UserSystem.find({approved: false})
      res.status(200).json(users)
      
   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Atualização de usuários do sistema (Update)
router.patch('/:id',verifyJwt, async (req, res) => {

   const id = req.params.id
   const {email,name, password, type, approved } = req.body
   const user = {
      email,
      name,
      password,
      type,
      approved
   }
   try {  
      const updateUser = await UserSystem.updateOne({_id: id}, user)
      if(updateUser.matchedCount === 0){
         res.status(422).json({message: 'Usuário não encontrado na base de dados!'})
         return
      }
      res.status(200).json({message: `Usuário ${name} atualizado com sucesso!`, user:user})

   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Deletar dados
router.delete('/:id',verifyJwt, async(req, res) =>{

   const id = req.params.id

   const user = await UserSystem.findOne({email: id})
   if(!user){
      res.status(422).json({message:'O usuário não foi encontrado!'})
      return
   }
   try {

      await UserSystem.deleteOne({email: id})
      res.status(200).json({message:"Usuário deletado com sucesso!"})
      
   } catch (error) {
      res.status(500).json({error: error})
   }
})

//Rota de login no sistema
router.post('/login', async(req, res) =>{
   const {email, password } = req.body
   if(!email || !password){res.status(422).json({message: "Email e senha são campos obrigatórios!"})
   return
   }
   //Pegando o user na base de dados
   const user = await UserSystem.findOne({email: email})
   if(!user){
     res.status(422).json({ message:`Email ${email} não cadastrado em nosso sistema`})
     return
   }

   try {

      if(user.approved !== true){
        res.status(422).json({message:"Conta não validada, fale com o administrador para solicitar a liberação!"})
        return
      }

      //O bcrypt desencripta a senha e compara com a senha informada pelo usuário se não for igual retorna mensagem "Senha inválida"
      const veryfyPassword = await bcrypt.compare(password, user.password)
      if(!veryfyPassword){
         res.status(422).json({message:"Senha inválida!"})
         return
      }
   
      await createUserToken(user, req, res)
      
   } catch (error) {
      res.status(500).json({error: error})
   }
 })

 //Rota para aprovação do usuário no sistema
 router.patch('/approved/:id',verifyJwt, async (req, res) => {
   console.log('Teste')
   const id = req.params.id

   const {email, name, password, type, approved } = req.body
   const users ={
      email,
      name,
      password,
      type,
      approved: true
   }
   try {  
      const updateUser = await UserSystem.updateOne({email: id}, users)
      if(updateUser.matchedCount === 0){
         res.status(422).json({message: 'Usuário não encontrado na base de dados!'})
         return
      }
      res.status(200).json('Usuário aprovado pelo administrador!')

   } catch (error) {
      res.status(500).json({error: error})
   }

})

//Rota para envio do código para a recuperação da senha
router.get('/send/:id', async (req,res) => {

   const code = CodeGenerator()
   const email = req.params.id;

   const verifyEmail = await UserSystem.findOne({email: email})

   if(!verifyEmail){
      res.status(500).json({message:`Email ${email} não existe em nossos registros.`})
      return
   }

   const veryfyEmailrecovery = await SaveCodeAndEmail.findOne({email: email})
   if(!veryfyEmailrecovery){
      console.log('Criou novo')
      await SaveCodeAndEmail.create({code,email});
   }else{
      console.log('Atualizou código')
      await SaveCodeAndEmail.updateOne({email:email},{$set:{code:code}})
   }

   let transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
       auth: {
           user: 'redefinirsenhacontrolbase@gmail.com',
           pass: process.env.MAIL_PASSWORD
       }
   });
   
     await transporter.sendMail({
     from: 'redefinirsenhacontrolbase@gmail.com',
     to: email,
     subject: 'Código para redefinir senha no APP Control Base!',
     text: "Código para redefinir sua senha...",
     html: `<h2>REDEFINIR SENHA</h2></br><h3>CÓDIGO DE ACESSO:</h3><h2>${code}</h2></br><h3>Se você não solicitou esse código por favor desconsidere.</h3>`
   })
   .then( res.status(200).json({message:"Email enviado com sucesso!"}))
   .catch(error =>  res.status(500).json({message:`Erro ao enviar o email ${error}`}));
})


module.exports = router

