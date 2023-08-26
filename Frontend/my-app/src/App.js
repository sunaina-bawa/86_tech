import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
      <UserForm />
      <PostForm />
      <UserList />
      <PostList />
      <UserAnalytics />
      <PostAnalytics />

      {/* <Router>
        <Route path="/" exact>
          <UserForm />
        </Route>
        <Route path="/users">
          <UserList />
        </Route>
        <Route path="/posts">
          <PostList />
        </Route>
        <Route path="/analytics/users">
          <UserAnalytics />
        </Route>
        <Route path="/analytics/posts">
          <PostAnalytics />
        </Route>
      </Router> */}
    </div>
  );
}

export default App;
