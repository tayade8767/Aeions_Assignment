
import { ApiError } from '../Utils/ApiError.js';
import { asyncHandler } from '../Utils/asyncHandler.js';
import { ApiResponse } from '../Utils/ApiResponse.js';

import User from '../Models/user.model.js';
import Expense from '../Models/expense.model.js';

import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const registerUser = asyncHandler( async (req,res) => {
    console.log("i am inside registe file");
     /* this is my steps first time */

//    step1 form for input --- postman
//    step2 store in session store karange
//    step3 store the data in the databse -- mongodb
//    step4 user register ho gaya to kuch bhi karo

    /*  this is the chai aur code logi  */

//  get the userdetails from frontend
//  validation - not empty
//  check if user is already exists : username, emial
//  create user object - create entry in db
//  remove password and refresh token field from response
//  check for user creation 
//  return response

    /*   this steps to follow to make the register route */

    const { email, fullname, username, password} = req.body;

    console.log("Received registration data:");
    console.log("Email:", email);
    console.log("Username:", username);
    console.log("Password:", password);
    console.log(password , fullname);

    // Here you would typically save the user to the database
    // For now, we'll just send back a success response

    if([email, fullname, username, password].some((field) => field.trim() === "")) {
        throw new ApiError(400,"One of the field is empty All field is required");
    }

    const existeduser = await User.findOne({
        $or: [ 
            { email },{ username } 
        ]
    });

    if(existeduser) {
        throw new ApiError(409,"Username with email or Password is already exists");
    }

    // const user = await User.create(())

    const hashpassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
        username : username.toLowerCase(),
        email : email,
        fullname : fullname,
        password : hashpassword ,
    })

    const token = jwt.sign(
        { 
            _id: user._id, 
            username: user.username, 
            email: user.email 
        }, 
        'akashtayade', 
        { 
            expiresIn: '10d'
        }
    );
    
    const createdUser = await User.findById(user._id)
    .select("-password");

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong While creating the User");
    }
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, 
                { user: createdUser , token },
                "User logged in successfully"
            )
        );

})

const loginUser = asyncHandler( async (req,res) => {
    
     /*      ALGORITHM   STARTS OF MINE    */

        //  get the data form the frontend 
        //  check that user present or not 
        //  if not present then show the message you dont have an account please login
        //  if user present then give him access 
        //  and give the login to him 

     /*      ALGORITHM   ENDS OF MINE    */

     /*      ALGORITHM   STARTS OF CHAIAURCODE    */

        //   req body -> data 
        //   username or email
        //   find the user
        //   password check
        //   access and refresh token
        //   send cookie

     /*      ALGORITHM   ENDS OF CHAIAURCODE    */

    const { username, password } = req.body;

    if(!username || !password){
        throw new ApiError(400,"username of password field is empty");
    }

    const user = await User.findOne( {username} );

    if(!user) {
        throw new ApiError(400,"User not found in database");
    }

    const isPasswordvalidate = await bcrypt.compare(password, user.password);

    if(!isPasswordvalidate) {
        throw new ApiError(400,"Incorrect password");
    }

    const token = jwt.sign(
        { 
            _id: user._id, 
            username: user.username, 
            email: user.email 
        }, 
        'akashtayade', 
        { 
            expiresIn: '10d'
        }
    );

    const loggedinUser = await User.findById(user._id)
    .select("-password");
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, 
                { user: loggedinUser,token },
                "User logged in successfully"
            )
        );

})

const validateToken = asyncHandler( async (req,res) => {
    return res.status(200).json(new ApiResponse(200, null, 'Token is valid'));
})

const createExpense = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError("All fields are required", 400);
    }

    const story = await Expense.create({
        userId: req.user._id,
        description,
        title
    });

    return res.status(200).json({
        success: true,
        data: story,
        message: "Expense created successfully",
    });
});

// Get all expenses for a user
const getExpenses = asyncHandler(async (req, res) => {
    const story = await Expense.find({ userId: req.user._id });
   return res.status(200).json({ success: true, data: story });
});

// Edit (Update) an expense
const updateExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedstory = await Expense.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        {  description, title },
        { new: true, runValidators: true }
    );

    if (!updatedstory) {
        throw new ApiError("Expense not found or unauthorized", 404);
    }

   return res.status(200).json({ success: true, data: updatedstory });
});

// Delete an expense
const deleteExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedstory = await Expense.findOneAndDelete({
        _id: id,
        userId: req.user._id,   
    });

    if (!deletedstory) {
        throw new ApiError("Expense not found or unauthorized", 404);
    }

   return res.status(200).json({ success: true, message: "Expense deleted successfully" });
});


export {
    registerUser,
    loginUser,
    validateToken,
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
}
