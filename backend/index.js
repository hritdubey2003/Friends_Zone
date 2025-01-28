import express from "express";
import connectDB from "./db/db.js";
import authRoute from "./route/auth.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth" , authRoute );

app.listen( process.env.PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${process.env.PORT}`);
    } catch(err) {
        console.log(err);
    }
});


