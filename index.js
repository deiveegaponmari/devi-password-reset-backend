const express=require("express");
const web_server=express();
var cors = require('cors')
require('dotenv').config()
console.log(process.env)
//middleware to parse json
web_server.use(express.json())
web_server.use(cors())
const{ UserRouter }=require("./controller/UserController");
//db connectivity
require("./dbconfig");
//routers injection
web_server.use('/user',UserRouter);

web_server.listen(process.env.HOST_PORT,process.env.HOST_NAME,()=>{
    console.log("server stated successfully")
    console.log(`http://${process.env.HOST_NAME}:${process.env.HOST_PORT}`);
})