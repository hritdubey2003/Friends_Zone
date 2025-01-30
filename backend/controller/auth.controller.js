import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { username, password, email , interests } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ message: "Please fill all the fields!" });
        }

        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email ID already exists!" });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const newUser = new userModel({ username, password: hashedPassword, email , interests });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "User not found!" });
        }

        const isPasswordValid = await user.comparePassword(password); 
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET );

        res.cookie("token", token );

        return res.status(200).json({ message: "Login successful!", token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};
