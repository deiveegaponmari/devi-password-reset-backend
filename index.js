const express=require("express");
const web_server=express();
var cors = require('cors')
require('dotenv').config()
//console.log(process.env)
//middleware to parse json
web_server.use(express.json())
web_server.use(cors({origin:["http://localhost:5173"]}))
const{ UserRouter }=require("./controller/UserController");
//db connectivity
require("./dbconfig");
//routers injection
web_server.use('/user',UserRouter);

web_server.listen(4000,()=>{
    console.log("server stated successfully")
    console.log(`http://${process.env.HOST_NAME}:${process.env.HOST_PORT}`);
})