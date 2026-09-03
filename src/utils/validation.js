const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } 
  else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateProfileEditData = (req) => {
  // const { firstName, lastName, emailId, password } = req.body;  
  const allowedFields = ["firstName", "lastName", "emailId", "about","skills","gender","age"];
  const fieldsToUpdate = Object.keys(req.body); 

  for (const field of fieldsToUpdate) {
    if (!allowedFields.includes(field)) {
      throw new Error(`Field '${field}' is not allowed for update`);
    }
  }
}
 
module.exports = { validateSignUpData ,validateProfileEditData};


// {
//     "firstName":"Divyam",
//     "lastName":"Bansal new",
// "emailId":
// "divyambansal123@gmail.com",
// "password":
// "Divyam@123"}