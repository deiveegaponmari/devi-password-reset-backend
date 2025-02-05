const jwt = require('jsonwebtoken');
require('dotenv').config()
 function tokenVerify(token){
    if(!token){
        throw new Error("No Token Provided")
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) { 
       throw new Error("Token Expired or Invalid")
    }
}
module.exports={
    tokenVerify
}