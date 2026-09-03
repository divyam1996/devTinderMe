const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/sendConnectionRequest", userAuth , async (req,res)=>{
    const user= req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Sending a connection request");

    res.send(user.firstName + " sent the connection request");
})

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

    //   if (fromUserId.toString() === toUserId.toString()) {
    //     return res.status(400).json({ message: "You cannot send a connection request to yourself." });
    //   }
 
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }
      // Check if the toUserId exists in the database

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }
      // Check if a connection request already exists between the two users

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // const emailRes = await sendEmail.run(
      //   "A new friend request from " + req.user.firstName,
      //   req.user.firstName + " is " + status + " in " + toUser.firstName
      // );
      // console.log(emailRes);

      res.json({
        message:
          "Connection Request sent successfully from " + req.user.firstName +
          " to " +
          toUser.firstName +
          " with status: " +
          status,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
      const loggedInUserId = req.user;
      const {status,requestId} = req.params;

      // loggedinuserId = touserid
      // status ="interested"
      // requestid should be valid

      // console.log("Logged in user ID: ", loggedInUserId._id.toString());
      // console.log("Request ID: ", requestId);
      // console.log("Status: ", status);


      const allowedStatus = ["accepted", "rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({ message: "Invalid status type: " + status });
      }
        const connectionRequest = await ConnectionRequest.findOne(
          { _id: requestId, toUserId: loggedInUserId._id.toString(), status: "interested" });

          // console.log("Logged in user ID: ", loggedInUserId._id);

          console.log("Connection Request found: ", connectionRequest);

          if (!connectionRequest) {
            return res.status(404).json({ message: "Connection Request not found or already reviewed." });
          }
          connectionRequest.status = status;
          const data = await connectionRequest.save();
          res.json({
            message: "Connection Request reviewed successfully with status: " + status,
            data,
          });

    }catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
}
);




module.exports = requestRouter;