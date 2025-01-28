import express from "express";
import { registerUser , loginUser , logoutUser } from "../controller/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const authRoute = express.Router();

authRoute.post('/register', registerUser );
authRoute.post('/login', loginUser );
authRoute.get('/logout', authUser , logoutUser );

export default authRoute;