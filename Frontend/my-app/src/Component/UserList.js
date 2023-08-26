import React, { useState, useEffect } from "react";
import axios from "./api"; // Import Axios instance
import UserForm from "./UserForm"; // Import UserForm component
import "../Styles/main.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [updateField, setUpdateField] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const [showUserForm, setShowUserForm] = useState(false); // To show/hide the UserForm

  useEffect(() => {
    // Fetch the list of users when the component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`);
      // Remove the deleted user from the state
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error(error);
      setError("Error deleting user.");
    }
  };

  const handleUpdateFieldChange = (field) => {
    setUpdateField(field);
    setUpdatedValue("");
  };

  const handleUpdate = async (userId) => {
    try {
      if (!updateField || !updatedValue) {
        throw new Error("Please select a field and enter a value.");
      }

      const updatedData = {
        [updateField]: updatedValue,
      };

      await axios.put(`/users/${userId}`, updatedData);
      // Update the user data in the state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...updatedData } : user
        )
      );
      setUpdateField(null);
      setUpdatedValue("");
    } catch (error) {
      console.error(error);
      setError("Error updating user.");
    }
  };

  return (
    <div className="user-list">
      <h2>User List</h2>
      <button onClick={() => setShowUserForm(!showUserForm)}>
        {showUserForm ? "Hide User List" : "View User List"}
      </button>
      {showUserForm && (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                      <button onClick={() => setSelectedUserId(user._id)}>
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedUserId && (
            <div className="update-form">
              <h3>Update User</h3>
              <select
                value={updateField}
                onChange={(e) => handleUpdateFieldChange(e.target.value)}
              >
                <option value="">Select Field to Update</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
              </select>
              <input
                type="text"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
                placeholder={`New ${updateField}`}
              />
              <button onClick={() => handleUpdate(selectedUserId)}>
                Update
              </button>
              <button onClick={() => setSelectedUserId(null)}>Cancel</button>
            </div>
          )}
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
}

export default UserList;
