const UserRouter=require("express").Router();
const { UserModel }=require("../model/UserModel");

UserRouter.post("/signup",async(req,res)=>{
    if(!req.body.email){
        return res.status(400).json({
            message:"Email is missing",
            success:"false"
        })
    }
    const matchingUser=await UserModel.findOne({email:req.body.email})
       if(matchingUser){
         return res.status(500).json({
            message:"ACCount already exists",
            success:"false"
        })
    }
    
    const newItem=new UserModel(req.body);
   const result=await newItem.save();
        if(result && result._id){
        return res.status(201).json({
            message:"Account created successfully",
            data:result,
            success:"true"
        })
    }else{
            return res.status(500).json({
                message:"Internal server error",
                success:"false"
        })
    }
    
})

//------------------signup completed----------------

UserRouter.post("/signin",async(req,res)=>{
    const EMAIL=req.body.email;
    const PASSWORD=req.body.password;
    if(!EMAIL && ! PASSWORD){
        return res.status(500).json({
            message:"Account not exists",
            success:"false"
    })
    }
    const matchinguser=await UserModel.findOne({email:EMAIL})
    if(matchinguser && matchinguser._id){
    if(PASSWORD===matchinguser.password){
        return res.status(200).json({
            message:"sign in successful",
            success:"true"
        })
    }else{
        return res.status(500).json({
            message:"Bad credentials",
            success:"false"
         
    })
    }
}else{
    return res.status(500).json({
        message:"Email is not valid",
        success:"false"
    
})
}
})
module.exports={
    UserRouter
}