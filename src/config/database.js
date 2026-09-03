const mongoose = require("mongoose");

const connectDB = async () => {
//   console.log(process.env.DB_CONNECTION_SECRET);
  await mongoose.connect("mongodb+srv://divyambansal17_db_user:Bansal2996@namastenode.ojzvory.mongodb.net/devTinder");
};

module.exports = connectDB;

