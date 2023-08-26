import React, { useState, useEffect } from "react";
import axios from "./api"; // Import Axios instance

function PostAnalytics() {
  const [totalPosts, setTotalPosts] = useState(0);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch post analytics data when the component mounts
    fetchPostAnalytics();
  }, []);

  const fetchPostAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const totalPostsResponse = await axios.get("/analytics/posts");
      const topLikedPostsResponse = await axios.get(
        "/analytics/posts/top-liked"
      );

      setTotalPosts(totalPostsResponse.data.totalPosts);
      setTopLikedPosts(topLikedPostsResponse.data);
    } catch (error) {
      console.error(error);
      setError("Error fetching post analytics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-analytics">
      <h2>Post Analytics</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Total Number of Posts: {totalPosts}</p>
          <h3>Top 5 Most Liked Posts:</h3>
          <ul>
            {topLikedPosts.map((post) => (
              <li key={post._id}>
                <p>Content:{post.content}</p>
                <p>Likes: {post.likes}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default PostAnalytics;
