const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const cors = require("cors");

//instance of express
const app= express();
app.use(cors());

app.use(express.json()); //middleware to parse json data in request body
app.use(cookieParser());

const authRouter = require("./routes/auth"); 
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/users");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.use("/test",(req,res)=>{
    res.send('Hello from the srever');
});

app.use("/hello",(req,res)=>{
    res.send('Hello from route');
});

// app.get("/user",(req,res)=>{
//     console.log('Hello from get');
// });




// app.post("/signup",async (req,res)=>{
//     try{
//     validateSignUpData(req);

//     const {firstName, lastName, emailId, password} = req.body;
//     //Encrypting the password before saving to database
//     const passwordHash = await bcrypt.hash(password,10);
//     console.log(passwordHash);
//     req.body.password = passwordHash;



//     //creating a new instance of user model
//     const user = new User({
//         firstName,
//         lastName,
//         emailId,
//         password: passwordHash
//     });
//     await user.save();
//     res.status(201).send('User created successfully');
//     }catch(err){
//         res.status(400).send('Error creating user' + err.message);
//     }
// });


// app.post("/login",async (req,res)=>{
//     try{
//     const { emailId, password} = req.body;

//     const user = await User.findOne({emailId});
//     if(!user){
//         return res.status(404).send('User not found');
//     }

//     const isPasswordValid = await bcrypt.compare(password,user.password);
//     if(!isPasswordValid){
//         return res.status(401).send('Invalid password');
//     }else{
//         // Creates a jwt token
//         // Add the token to the cookie and send the response back to the user
//         const token = await jwt.sign({_id:user._id},"DEV@Tinder$790"
//             // ,{expiresIn: "30d"}
//         );
//         console.log(token);
//         res.cookie("token",token,{
//             httpOnly: true
//         });

//         res.status(200).send('Login successful');
//     }
//     }catch(err){
//         res.status(400).send('Error ' + err.message);
//     }
// });

// app.get("/profile", userAuth ,async(req,res)=>{
//     try {
//         const user = req.user; // user is set in the userAuth middleware

//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         res.status(200).json(user);
//     } catch (err) {
//         if (err.name === 'JsonWebTokenError') {
//             return res.status(401).send('Invalid token');
//         }
//         res.status(400).send('Error fetching profile: ' + err.message);
//     }
// });

//get user by email
app.get("/user",async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({emailId: userEmail});
        if(user){
           res.status(200).json(user);
        }else{
            res.status(404).send('User not found');
        }
    }catch(err){
        res.status(400).send('Error fetching user');
    }
});


app.get("/feed",async (req,res)=>{
    try{
        const user = await User.find({});
        if(user){
           res.status(200).json(user);
        }else{
            res.status(404).send('User not found');
        }
    }catch(err){
        res.status(400).send('Error fetching user');
    }
});

app.delete("/user",async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findOneAndDelete({_id: userId});
        if(user){
            res.status(200).send('User deleted successfully');
        }else{
            res.status(404).send('User not found');
        }
    }catch(err){
        res.status(400).send('Error deleting user');
    }
});


app.patch("/user",async (req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({_id: userId},data,
            {
                returnDocument: "after",
                runValidators: true
            }
        );
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).send('User not found');
        }
    }catch(err){
        res.status(400).send('Error updating user'+ err.message);
    }
});


connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });  


// app.listen(7777,()=>{
//     console.log('Server is running on port 3000');
// });