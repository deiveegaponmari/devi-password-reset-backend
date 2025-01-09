var jwt = require('jsonwebtoken');
function generateToken(data={},SECRET_KEY=process.env.JWT_SECRET,expiryTime){
var token=jwt.sign(data,SECRET_KEY,{
    expiresIn:expiryTime
})
return token;
}
module.exports={
    generateToken
}