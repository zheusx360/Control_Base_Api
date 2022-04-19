const CodeGenerator = () => {
   let stringAleatoria = '';
   var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@&';
   for (var i = 0; i < 8; i++) {
       stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
   }
   return stringAleatoria;
}

module.exports = CodeGenerator;