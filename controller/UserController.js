const UserRouter=require("express").Router();
const bcrypt = require('bcrypt');
const { UserModel }=require("../model/UserModel");
const jwt = require('jsonwebtoken');

UserRouter.post("/api/signup",async(req,res)=>{
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
    
    /* const newItem=new UserModel(req.body);
   const result=await newItem.save(); */
   const {first_name,last_name,email,password}=req.body;
   const hashpassword=await bcrypt.hash(password,10);
   const newItem=new UserModel({first_name,last_name,email,password:hashpassword}) 
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
UserRouter.post("/request-reset",(req,res)=>{
    const {email}=req.body;
    if(!email){
        res.status(400).json({
            message:"Email is required",
            success:false
        })
    }
    const user=UserModel.findOne({email})
    if(!user){
        res.status(404).json({
            message:"User Not Found",
            success:false
        })
        }
        //Generate the token
        const token=jwt.sign({id:user._id,email:user.email}, process.env.JWT_SECRET,
            {expiresIn:"1h"})
            console.log(`reset token is,${token}`)
           return  res.status(200).json({
            message:"password reset link send to email",
            success:true
           })
})

UserRouter.get('/verify-reset/:token', (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({
            message: "Token is valid",
            success: "true",
            data: decoded
        });
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: "false"
        });
    }
});

UserRouter.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({
            message: "Token and new password are required",
            success: "false"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: "false"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password has been reset successfully",
            success: "true"
        });
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: "false"
        });
    }
});


module.exports={
    UserRouter
}