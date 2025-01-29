import express from "express";
import { sendFriendRequest , acceptFriendRequest , rejectFriendRequest , getFriendsList , unfriendUser } from "../controller/friend.controller.js";
import { getFriendRecommendations } from "../controller/friendRecommendation.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const friendRoute = express.Router();

friendRoute.post("/send-request/:friendId", authUser, sendFriendRequest);
friendRoute.post("/accept-request/:friendId", authUser, acceptFriendRequest);
friendRoute.post("/reject-request/:friendId", authUser, rejectFriendRequest);
friendRoute.get("/friends", authUser, getFriendsList);
friendRoute.delete("/unfriend/:friendId", authUser, unfriendUser);
friendRoute.get("/recommendations", authUser, getFriendRecommendations);

export default friendRoute;
