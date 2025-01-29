import userModel from "../model/user.model.js";
import mongoose from 'mongoose'

export const sendFriendRequest = async (req, res) => {
    try {
        const { friendId } = req.params;
        const userId = req.user._id;

        if (userId.toString() === friendId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself!" });
        }

        const user = await userModel.findById(userId);
        const friend = await userModel.findById(friendId);

        if (!friend) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: "You are already friends!" });
        }

        if (user.sentRequests.includes(friendId)) {
            return res.status(400).json({ message: "Friend request already sent!" });
        }

        user.sentRequests.push(friendId);
        friend.receivedRequests.push(userId);

        await user.save();
        await friend.save();

        return res.status(200).json({ message: "Friend request sent!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error!" });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { friendId } = req.params; 
        const userId = req.user._id;
        console.log( 'current User logged in', userId );
        console.log('User whose friend request has to be accepted' , friendId );

        const user = await userModel.findById(userId);
        const friend = await userModel.findById(friendId);

        if (!friend) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (!user.receivedRequests.some(id => id.toString() === friendId)) {
            return res.status(400).json({ message: "No friend request from this user!" });
        }

        user.friends.push(friendId);
        friend.friends.push(userId);

        user.receivedRequests = user.receivedRequests.filter((id) => id.toString() !== friendId);
        friend.sentRequests = friend.sentRequests.filter((id) => id.toString() !== userId.toString());

        await user.save();
        await friend.save();

        return res.status(200).json({ message: "Friend request accepted!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error!" });
    }
};


export const rejectFriendRequest = async (req, res) => {
    try {
        const { friendId } = req.params;
        const userId = req.user._id;

        console.log('Logged in user: ', userId);
        console.log('Friend request to be rejected from: ', friendId);

        const user = await userModel.findById(userId);
        const friend = await userModel.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User or Friend not found!" });
        }

        if (!user.receivedRequests.includes(friendId)) {
            return res.status(400).json({ message: "No friend request to reject!" });
        }

        user.receivedRequests = user.receivedRequests.filter(id => id.toString() !== friendId);
        friend.sentRequests = friend.sentRequests.filter(id => id.toString() !== userId.toString());

        await user.save();
        await friend.save();

        return res.status(200).json({ message: "Friend request rejected successfully!" });
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ message: "Server error!" });
    }
};


export const getFriendsList = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).populate("friends", "username email");

        return res.status(200).json(user.friends);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error!" });
    }
};

export const unfriendUser = async (req, res) => {
    try {
        const { friendId } = req.params;
        const userId = req.user._id;  

        console.log( 'logged in user: ' , userId );
        console.log('friendId' , friendId)

        const user = await userModel.findById(userId);
        const friend = await userModel.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found!" });
        }

        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());

        await user.save();
        await friend.save();

        return res.status(200).json({ message: "Unfriended successfully!" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server error!" });
    }
};
