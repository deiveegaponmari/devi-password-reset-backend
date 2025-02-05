const UserRouter = require("express").Router();
const bcrypt = require('bcrypt');
const { UserModel } = require("../model/UserModel");
//const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/jwt");
const { sendMail } = require("../utils/nodemailer/nodeMailer.js");
const { tokenVerify } = require("../middlewares/tokenVerify.js");



UserRouter.post("/api/signup", async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({
            message: "Email is missing",
            success: "false"
        })
    }
    const matchingUser = await UserModel.findOne({ email: req.body.email })
    if (matchingUser) {
        return res.status(500).json({
            message: "ACCount already exists",
            success: "false"
        })
    }

    /* const newItem=new UserModel(req.body);
   const result=await newItem.save(); */
    const { firstName, lastName, email, password } = req.body;
    const hashpassword = await bcrypt.hash(password, 6);
    const newItem = new UserModel({ first_name: firstName, last_name: lastName, email, password: hashpassword })
    const result = await newItem.save();
    if (result && result._id) {
        return res.status(201).json({
            message: "Account created successfully",
            data: result,
            success: "true"
        })
    } else {
        return res.status(500).json({
            message: "Internal server error",
            success: "false"
        })
    }

})

//------------------signup completed----------------

UserRouter.post("/signin", async (req, res) => {
    const EMAIL = req.body.email;
    const PASSWORD = req.body.password;
    console.log(PASSWORD)
    if (!EMAIL || !PASSWORD) {
        return res.status(500).json({
            message: "Account not exists",
            success: "false"
        })
    }
    try{
        const matchinguser = await UserModel.findOne({ email: EMAIL })
         console.log(matchinguser.email)
        if(!matchinguser){
         return res.status(404).json({
             message: "Valid User Not Found",
             success: false
         });
        }
     
         // Compare the entered password with the stored hashed password
         const isPasswordValid = bcrypt.compareSync(PASSWORD, matchinguser.password);
         console.log(isPasswordValid)
     
         if (!isPasswordValid) {
             return res.status(401).json({
                 message: "Invalid credentials",
                 success: false
             });
         }
     
         return res.status(200).json({
             message: "Sign in successful",
             success: true,
             token: generateToken({ userId: matchinguser._id },undefined)
         });
    }catch (error) {
        console.error("Error during signin:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
})

UserRouter.post("/request-reset", async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    message: "Email is required",
                    success: false,
                });
            }
    
            const user = await UserModel.findOne({ email });
            console.log("User found:", user ? user._id : "No user found");
    
            if (!user) {
                return res.status(404).json({
                    message: "User Not Found",
                    success: false,
                });
            }
    
            await sendMail(email, generateToken({email:email}, undefined, "1h"));
            return res.status(200).json({
                message: "Password reset link sent to email",
                success: true,
            });
        } catch (error) {
            console.error("Error in request-reset:", error);
            return res.status(500).json({
                message: "Internal server error",
                success: false,
            });
        }
    });

UserRouter.put('/reset-password/:token', async (req, res) => {
  //  const {token}=req.params;
    const { password  } = req.body;
    const{token}=req.params;

    try{
        if(!token){
            res.status(400).json({
                error:"Token is required"
            })
        }
        if(!password){
            res.status(400).json({
                error:"Password is required"
            })
        }
        //verify the token
        const user=tokenVerify(token);
        console.log(user.email)
        //verify the user exists
        const existingUser= await UserModel.findOne({email:user.email})
        if(!existingUser){
            return res.status(404).json({
                error:"User not found or Token is invalid"
            })
        }
        //hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();

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
    })   

   


module.exports = {
    UserRouter
}