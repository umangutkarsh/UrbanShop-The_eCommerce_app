import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";


// Protect routes
const protect = asyncHandler(async (req, res, next) => {

   let token;

   // Read the JWT from the 'jwt' cookie
   token = req.cookies.jwt;

   if (token) {
      try {
         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
         req.user = await User.findById(decodedToken.userId).select('-password');
         next();
      } catch (error) {
         console.error(error);
         req.status(401);
         throw new Error('Not authorised, token failed');
      }
   }

   else {
      res.status(401);
      throw new Error('Not authorised, no token');
   }
});


// Admin middleware
const admin = (req, res, next) => {

   if (req.user && req.user.isAdmin) {
      next();
   }

   else {
      res.status(401);
      throw new Error('Not authorised as admin');
   }
};

export { protect, admin };