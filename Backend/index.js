const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator"); // Import express-validator
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const cors = require("cors");
// ...

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8967;

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/social-media", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define validation rules for user input
const validateUserInput = [
  body("name").trim().isLength({ min: 1, max: 50 }),
  body("email").trim().isEmail(),
  body("bio").trim().isLength({ max: 200 }),
];

// Create a new user with validation
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/users", validateUserInput, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // No validation errors, create the user
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/analytics/users", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.send({ totalUsers });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/analytics/users/top-active", async (req, res) => {
  try {
    const topActiveUsers = await User.aggregate([
      {
        $lookup: {
          from: "posts", // Assuming your posts collection is named 'posts'
          localField: "_id",
          foreignField: "user_id",
          as: "posts",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          postCount: { $size: "$posts" },
        },
      },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
    ]);
    res.send(topActiveUsers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Other routes and endpoints

// post

app.post("/posts", async (req, res) => {
  try {
    const { user_id, content } = req.body;
    const post = new Post({ user_id, content });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/posts/:id/like", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/posts/:id/unlike", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: -1 } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/analytics/posts", async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    res.send({ totalPosts });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/analytics/posts/top-liked", async (req, res) => {
  try {
    const topLikedPosts = await Post.find().sort({ likes: -1 }).limit(5);
    res.send(topLikedPosts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
