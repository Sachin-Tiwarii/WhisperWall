const express = require("express");
const User = require("../models/User");
const Confession = require("../models/Confession");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.get("/posts", authMiddleware, adminMiddleware, async (req, res) => {
  const posts = await Confession.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.delete("/post/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await Confession.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

router.delete("/comment/:postId/:commentId", authMiddleware, adminMiddleware, async (req, res) => {
  const post = await Confession.findById(req.params.postId);
  post.comments.id(req.params.commentId).deleteOne();
  await post.save();
  res.json({ message: "Comment deleted" });
});

router.delete("/user/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

const Report = require("../models/Report");

router.get("/reports", authMiddleware, adminMiddleware, async (req, res) => {
  const reports = await Report.find({ status: "pending" })
    .populate("post")
    .populate("reportedBy", "email");

  res.json(reports);
});

router.put("/report/:id/resolve", authMiddleware, adminMiddleware, async (req, res) => {
  await Report.findByIdAndUpdate(req.params.id, { status: "resolved" });
  res.json({ message: "Report resolved" });
});

module.exports = router;
