const mongoose = require('mongoose');
const UserSchema=mongoose.Schema({
    "first_name":{
        type:String,
        required:true
    },
    "last_name":{
        type:String,
        required:true
    },
    "email":{
        type:String,
        required:true
    },
    "password":{
        type:String,
        required:true
    }
},{timestamps:true})

const UserModel=mongoose.model("users",UserSchema);
module.exports={
    UserModel
}