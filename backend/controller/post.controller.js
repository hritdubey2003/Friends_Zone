import Post from "../model/posts.model.js";
import userModel from "../model/user.model.js";

// Create a new post
export const createPost = async (req, res) => {
  const { content, img_url } = req.body;
  const userId = req.user._id; // Assuming the user is authenticated and user details are added to the req object

  if (!content) {
    return res.status(400).json({ message: "⚠️ Content is required to create a post!" });
  }

  try {
    // Create a new post object with content and image URL (if provided)
    const newPost = new Post({
      user: userId,
      content,
      img_url: img_url || null, // Use provided img_url or null if not provided
    });

    // Save the post to the database
    await newPost.save();

    res.status(201).json({
      message: "✅ Post created successfully!",
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Something went wrong while creating the post!" });
  }
};


export const deletePost = async (req, res) => {
    const postId = req.params.id;  // Get the post ID from the request params
    const userId = req.user._id;  // Get the user ID from the authenticated user (attached to the request object)
  
    try {
      // Find the post by its ID
      const post = await Post.findById(postId);
  
      // If the post does not exist
      if (!post) {
        return res.status(404).json({ message: "❌ Post not found!" });
      }
  
      // Check if the post belongs to the authenticated user
      if (post.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "⚠️ You do not have permission to delete this post!" });
      }
  
      // Delete the post using findByIdAndDelete method
      await Post.findByIdAndDelete(postId);
  
      // Respond with success
      res.status(200).json({ message: "✅ Post deleted successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "❌ Something went wrong while deleting the post!" });
    }
  };
  

  export const getPosts = async (req, res) => {
    const userId = req.user._id; // Get the userId from the request (authenticated user)
  
    try {
      // Fetch all posts and populate the user field with username and email
      const posts = await Post.find()
        .populate('user', 'username email friends')  // Populate the post creator's info including friends
        .sort({ createdAt: -1 }); // Sort posts by creation date (newest first)
  
      // Filter posts where the user is friends with the post creator
      const visiblePosts = posts.filter(post => {
        const postCreatorId = post.user._id.toString();
        // Check if the user is a friend of the post creator or the user is viewing their own posts
        const isFriend = post.user.friends.includes(userId.toString()) || postCreatorId === userId.toString();
        return isFriend;
      });
  
      if (visiblePosts.length === 0) {
        return res.status(404).json({ message: "❌ No posts available to display." });
      }
  
      return res.status(200).json(visiblePosts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "❌ Something went wrong while fetching posts." });
    }
  };