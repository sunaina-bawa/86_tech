import React, { useState, useEffect } from "react";
import axios from "./api"; // Import Axios instance

function UserAnalytics() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [topActiveUsers, setTopActiveUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user analytics data when the component mounts
    fetchUserAnalytics();
  }, []);

  const fetchUserAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const responseTotalUsers = await axios.get("/analytics/users");
      setTotalUsers(responseTotalUsers.data.totalUsers);

      const responseTopActiveUsers = await axios.get(
        "/analytics/users/top-active"
      );
      setTopActiveUsers(responseTopActiveUsers.data);
    } catch (error) {
      console.error(error);
      setError("Error fetching user analytics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-analytics">
      <h2>User Analytics</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Total Users: {totalUsers}</p>
          <h3>Top Active Users</h3>
          <ul>
            {topActiveUsers.map((user) => (
              <li key={user._id}>
                {user.name} - Posts: {user.postCount}
              </li>
            ))}
          </ul>
        </>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default UserAnalytics;
