import React from "react";
import { Routes, Route } from "react-router-dom";

import UserList from "./Component/UserList";
import PostList from "./Component/PostList";
import UserAnalytics from "./Component/UserAnalytics";
import PostAnalytics from "./Component/PostAnalytics";
import "./App.css"; // Import your CSS styles
import UserForm from "./Component/UserForm";
import PostForm from "./Component/PostForm";
import Navbar from "./Component/Navbar";

function App() {
  return (
    <div className="app">
      <Navbar />
      {/* <UserForm />
      <PostForm />
      <UserList />
      <PostList />
      <UserAnalytics />
      <PostAnalytics /> */}

      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/postform" element={<PostForm />} />
        <Route path="/users" element={<UserList />} />

        <Route path="/posts" element={<PostList />} />

        <Route path="/analytics/users" element={<UserAnalytics />} />

        <Route path="/analytics/posts" element={<PostAnalytics />} />
      </Routes>
    </div>
  );
}

export default App;
