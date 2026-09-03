// {
// "emailId":
// "divyambansal123@gmail.com",  rohitsharma@gmail.com
// "password":
// "Divyam@123"    "Rohit@123"}


const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth ,async(req,res)=>{
    try {
        const user = req.user; // user is set in the userAuth middleware

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user);
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).send('Invalid token');
        }
        res.status(400).send('Error fetching profile: ' + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth , async(req, res)=>{
    try{
        validateProfileEditData(req);
        const loggedInUser = req.user; // user is set in the userAuth middleware

        if (!loggedInUser) {
            return res.status(404).send('User not found');
        }   
        console.log('Logged in user: before', loggedInUser);

        Object.keys(req.body).forEach((key)=>{
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();
        console.log('Logged in user:', loggedInUser);
        res.send(`${loggedInUser.firstName} ${loggedInUser.lastName} profile updated successfully`);
    }catch(err){
        return res.status(400).send('Invalid data: ' + err.message);
    } 
    
})

profileRouter.patch("/profile/forgot-password", async(req, res)=>{
    try{
        const { emailId, newPassword } = req.body;

        if (!emailId || !newPassword) {
            return res.status(400).send('Email and new password are required');
        }

        if (!validator.isEmail(emailId)) {
            return res.status(400).send('Email is not valid');
        }

        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).send('Please enter a strong password');
        }

        const user = await User.findOne({ emailId: emailId.toLowerCase() });
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).send('Password updated successfully');
    }catch(err){
        return res.status(400).send('Invalid data: ' + err.message);
    }
})
module.exports = profileRouter;