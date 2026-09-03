const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req,res,next)=>{
    try{
    // Read the token from Req cookies
    //Validate the token
    // Find the user
    const {token} = req.cookies;
    if(!token){
        res.status(401).send('Token not found');
    }

    const decodedObj = await jwt.verify(token,"DEV@Tinder$790");

    const {_id} = decodedObj;
    const user = await User.findById(_id);
    if(!user){
        res.status(401).send('Unauthorized');
    }else{
        req.user = user;
        next(); // move to the next middleware or route handler     
    }
}catch(err){
    res.status(400).send('Error ' + err.message);
}

};

module.exports = { userAuth };