const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user"); 


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user; // user is set in the userAuth middleware
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate('fromUserId toUserId', 'firstName lastName emailId');

        res.json(connectionRequests);

    } catch (err) {
        res.status(400).send('Error ' + err.message);
    }
});


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user; // user is set in the userAuth middleware  

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);


        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });

        // res.json({ data: connectionRequests });




    } catch (err) {
        res.status(400).send('Error ' + err.message);
    }
});


userRouter.get("/feed", userAuth, async (req, res) => {
    try {
    // user should see all the cards except the users he has already sent connection request to or received connection request from 
    // also not his and ignored people

        const loggedInUser = req.user; // user is set in the userAuth middleware   

        const page= parseInt(req.query.page) || 1;
        let limit= parseInt(req.query.limit) || 10;

        limit = limit>50 ? 50 : limit; 

        const skip= (page-1)*limit;
        
        //Find all connection requests where the logged-in user is either the sender or receiver
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ],
        }).select('fromUserId toUserId status')
        // .populate('fromUserId', 'firstName').populate('toUserId', 'firstName');

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        console.log("Users to hide from feed: ", hideUsersFromFeed);

        const users = await User.find({
           $and:[ {_id: { $nin: Array.from(hideUsersFromFeed) }}, { _id: { $ne: loggedInUser._id } }],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

         res.json({ data: users });

                
    } catch (err) {
        res.status(400).send('Error ' + err.message);
    }   
});


module.exports =  userRouter ;