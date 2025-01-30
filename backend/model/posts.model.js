import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Linking post to a user
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  img_url: {
    type: String,
    trim: true, // Ensure the URL is trimmed
    default: null, // Optional, user can skip the image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
