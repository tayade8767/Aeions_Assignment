import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/ApiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import User from "../Models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        console.log("Inside verifyJWT middleware");
        
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Token received in middleware:", token);


        if (!token) {
            throw new ApiError("Not authorized, token is missing", 401);
        }

        const decodedToken = jwt.verify(token, "akashtayade");
        console.log("Decoded token:", decodedToken); // Debugging

        const user = await User.findById(decodedToken?._id).select("-password");
        if (!user) {
            throw new ApiError("User not found", 404);
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        throw new ApiError(401, "Invalid access token");
    }
});

export { verifyJWT };
