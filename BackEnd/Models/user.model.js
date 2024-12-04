import mongoose from "mongoose";
import { Schema } from "mongoose";

const Userschema = new mongoose.Schema({

    username : {
        type: String,
        require: true,
    },
    email : {
        type: String,
        require : true,
    },
    password : {
        type : String,
        require : true,
    },
    fullname : {
        type : String,
        require : true,
    }

});

const User = mongoose.model("User",Userschema);

export default User;

