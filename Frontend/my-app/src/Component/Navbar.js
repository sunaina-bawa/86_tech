import React from "react";
import { Link } from "react-router-dom";
import "../Styles/main.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/postform">PostForm</Link>
        </li>
        
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <Link to="/analytics/users">User Analytics</Link>
        </li>
        <li>
          <Link to="/analytics/posts">Post Analytics</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
