import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token; // Retrieve the token from cookies

        if (!token) {
            return res.status(403).json({ message: "Token is required!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found!" });
        }

        req.user = user; // Attach user object to the request for further use
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid or expired token!" });
    }
};
