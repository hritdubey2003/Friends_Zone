import express from "express";
import connectDB from "./db/db.js";
import authRoute from "./route/auth.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
import friendRoute from "./route/friend.route.js";
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',  
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('<h1>Server is Healthy.</h1>');
});

app.use("/api/auth" , authRoute );
app.use("/api/friend" , friendRoute );


app.listen( process.env.PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${process.env.PORT}`);
    } catch(err) {
        console.log(err);
    }
});


