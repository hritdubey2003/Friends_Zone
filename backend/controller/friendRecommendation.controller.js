import userModel from "../model/user.model.js";

export const getFriendRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId).populate("friends");
        const friends = user.friends.map((f) => f._id);

        const mutualFriends = await userModel.aggregate([
            { $match: { _id: { $in: friends } } },
            { $unwind: "$friends" },
            { $match: { friends: { $ne: userId, $nin: friends } } }, 
            { 
                $group: { 
                    _id: "$friends", 
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { count: -1 } },
            { 
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                } 
            },
            { $unwind: "$userDetails" },
            { 
                $project: {
                    _id: "$userDetails._id",
                    username: "$userDetails.username",
                    email: "$userDetails.email",
                    interests: "$userDetails.interests",
                    mutualCount: "$count"
                } 
            }
        ]);

        const interestRecommendations = await userModel.find({
            _id: { $nin: friends.concat(userId) },
            interests: { $in: user.interests }
        }).select("_id username email interests");

        const recommendations = [...mutualFriends];
        interestRecommendations.forEach((rec) => {
            if (!recommendations.find((mf) => mf._id.toString() === rec._id.toString())) {
                recommendations.push(rec);
            }
        });

        return res.status(200).json(recommendations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error!" });
    }
};
