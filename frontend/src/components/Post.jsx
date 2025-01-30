import React, { useState } from "react";
import axios from "axios";

const Post = ({ post }) => {
  const [liked, setLiked] = useState(post.likes.includes(post.user._id));

  const handleLike = () => {
    axios
      .post(`/api/posts/like/${post._id}`, {}, { withCredentials: true })
      .then(() => setLiked(!liked))
      .catch((error) => console.error("Error liking post:", error));
  };

  const handleDelete = () => {
    axios
      .delete(`/api/posts/delete/${post._id}`, { withCredentials: true })
      .then(() => {
        // Refresh the feed after deleting the post
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  return (
    <div className="post">
      <div className="post-header">
        <img src={post.user.avatar} alt="user-avatar" />
        <span>{post.user.username}</span>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="post-image" />}
      </div>
      <div className="post-actions">
        <button onClick={handleLike}>{liked ? "Unlike" : "Like"}</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
      {/* Comment section can be added here */}
    </div>
  );
};

export default Post;
