import express from "express";
import { createPost , getPosts , deletePost } from "../controller/post.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const postroute = express.Router();

postroute.post("/create", authUser , createPost);
postroute.delete("/delete/:id", authUser , deletePost);
postroute.get("/posts", authUser , getPosts);

export default postroute;
