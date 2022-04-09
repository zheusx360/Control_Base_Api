const jwt = require('jsonwebtoken')


const createUserToken = async(user, req, res) => {

   const token = jwt.sign({ userId: user._id},process.env.SECRET, { expiresIn: '1d'});

   const userAuth = {
      email: user.email,
      name: user.name,
      type: user.type,
      approved: user.approved
   }

   return res.json({message: "Usuário autenticado",userAuth , token})

}


module.exports = createUserToken