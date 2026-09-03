const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String ,
        required: true,
        minLength: 4
    },
    lastName: { 
        type: String 
    },
    emailId: { 
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
         validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: { 
        type: String ,
        required: true
    },
    age: { 
        type: Number,
        min: 18
    },
    gender: { 
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value.toLowerCase()))
                throw new Error("Invalid gender");
        }
    },
    photoUrl: { 
        type: String 
    },
    about: { 
        type: String,
        default: "Hello! I'm new to DevTinder. Looking forward to connecting with fellow developers!"
    },
    skills: { 
        type: [String] 
    }
},{timestamps: true});

userSchema.index({ firstName: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;
