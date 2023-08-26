import React, { useState, useEffect } from "react";
import axios from "./api"; // Import Axios instance
import "../Styles/main.css"; // Import your CSS file

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likeSuccess, setLikeSuccess] = useState({});
  const [unlikeSuccess, setUnlikeSuccess] = useState({});
  const [deleteSuccess, setDeleteSuccess] = useState({});
  const [isViewVisible, setIsViewVisible] = useState(false); // State to manage visibility

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error(error);
      setError("Error fetching posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`);
      // Remove the deleted post from the state
      setPosts(posts.filter((post) => post._id !== postId));
      setDeleteSuccess({ [postId]: "Entry successfully deleted." });
      setTimeout(() => {
        setDeleteSuccess({});
      }, 1000); // Clear delete success message after 1 second
    } catch (error) {
      console.error(error);
      setError("Error deleting post.");
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/like`);
      // Update the like count in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
      setLikeSuccess({ [postId]: "Like successful." });
      setTimeout(() => {
        setLikeSuccess({});
      }, 1000); // Clear like success message after 1 second
    } catch (error) {
      console.error(error);
      setError("Error liking post.");
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/unlike`);
      // Update the like count in the state (not below 0)
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: Math.max(post.likes - 1, 0) }
            : post
        )
      );
      setUnlikeSuccess({ [postId]: "Unlike successful." });
      setTimeout(() => {
        setUnlikeSuccess({});
      }, 1000); // Clear unlike success message after 1 second
    } catch (error) {
      console.error(error);
      setError("Error unliking post.");
    }
  };

  return (
    <div className="post-list">
      <h2>Post List</h2>
      {!isViewVisible && (
        <button onClick={() => setIsViewVisible(true)}>View Post List</button>
      )}
      {isViewVisible && (
        <table>
          <thead>
            <tr>
              <th>Content</th>
              <th>User ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.content}</td>
                <td>{post.user_id}</td>
                <td>
                  <button onClick={() => handleDelete(post._id)}>Delete</button>
                  <button onClick={() => handleLike(post._id)}>Like</button>
                  <button onClick={() => handleUnlike(post._id)}>Unlike</button>
                  {deleteSuccess[post._id] && (
                    <span className="success">{deleteSuccess[post._id]}</span>
                  )}
                  {likeSuccess[post._id] && (
                    <span className="success">{likeSuccess[post._id]}</span>
                  )}
                  {unlikeSuccess[post._id] && (
                    <span className="success">{unlikeSuccess[post._id]}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default PostList;
