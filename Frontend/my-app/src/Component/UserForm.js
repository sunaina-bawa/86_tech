import React, { useState } from "react";
import axios from "./api"; // Make sure this path is correct

function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/users", { name, email, bio });
      console.log(response.data);

      if (response.data.userExists) {
        setError("User already exists.");
      } else {
        setSuccessMessage("User successfully created!");
        setName("");
        setEmail("");
        setBio("");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 1000); // Clear messages after 1 second
    }
  };

  return (
    <div className="user-form">
      <h2>Create User</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Bio:
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}

export default UserForm;
