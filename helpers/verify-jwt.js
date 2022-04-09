const jwt = require('jsonwebtoken')

const verifyJwt = async (req, res, next) => {
   console.log("jwt teste")
   const token = req.headers['x-access-token'];
   console.log(token)
   jwt.verify(token,process.env.SECRET, (err, decoded) =>{
      if(err) return res.status(401).json({message: "Acesso negado! tente fazer o login novamente."});
      req.userId = decoded.userId;
      next();
   } )
}

module.exports = verifyJwt