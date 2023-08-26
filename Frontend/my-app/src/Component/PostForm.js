import React, { useState, useEffect } from "react";
import axios from "./api"; // Import Axios instance
import "../Styles/main.css"; // Import your CSS styles for the form

function PostForm() {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error fetching users.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (!selectedUserId || !content) {
        throw new Error("Please select a user and provide content.");
      }

      const postData = {
        user_id: selectedUserId,
        content: content,
      };

      await axios.post("/posts", postData);
      setContent("");
      setSelectedUserId("");
      setSuccessMsg("Post created successfully!");
    } catch (error) {
      console.error(error);
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 1000); // Clear messages after 1 second
    }
  };

  return (
    <div className="create-post-form">
      <h2>Create Post</h2>
      {successMsg && <p className="success">{successMsg}</p>}
      <form onSubmit={handleSubmit}>
        {/* Select User */}
        <div>
          <label>Select User:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        {/* Post Content */}
        <div>
          <label>Post Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={300}
            required
          />
        </div>
        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
        {errorMsg && <p className="error">{errorMsg}</p>}
      </form>
    </div>
  );
}

export default PostForm;
