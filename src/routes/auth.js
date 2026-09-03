const express = require("express");

const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signup",async (req,res)=>{
    try{
    validateSignUpData(req);

    const {firstName, lastName, emailId, password} = req.body;
    //Encrypting the password before saving to database
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash);
    req.body.password = passwordHash;



    //creating a new instance of user model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    });
    await user.save();
    res.status(201).send('User created successfully');
    }catch(err){
        res.status(400).send('Error creating user' + err.message);
    }
});

authRouter.post("/login",async (req,res)=>{
    try{
    const { emailId, password} = req.body;

    const user = await User.findOne({emailId});
    if(!user){
        return res.status(404).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).send('Invalid password');
    }else{
        // Creates a jwt token
        // Add the token to the cookie and send the response back to the user
        const token = await jwt.sign({_id:user._id},"DEV@Tinder$790"
            // ,{expiresIn: "30d"}
        );
        console.log(token);
        res.cookie("token",token,{
            httpOnly: true
        });

        res.status(200).send('Login successful');
    }
    }catch(err){
        res.status(400).send('Error ' + err.message);
    }
});

authRouter.post("/logout" , async (req,res)=>{
    res.cookie("token",null,{
        expiress: new Date(Date.now()),
    });
    res.status(200).send('Logout successful');
})


module.exports = authRouter;



// emailId
// "divyambansal17@gmail.com"
// password
// "password123"