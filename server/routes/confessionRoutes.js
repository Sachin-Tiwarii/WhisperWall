const express = require("express");
const Confession = require("../models/Confession");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const confession = await Confession.create({
      text: req.body.text,
      user: req.user,
    });

    const populated = await Confession.findById(confession._id)
      .populate("user", "email")
      .populate("comments.user", "email");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const confessions = await Confession.find()
      .populate("user", "email")
      .populate("comments.user", "email")
      .sort({ createdAt: -1 });

    res.json(confessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/like", authMiddleware, async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    const alreadyLiked = confession.likes.some(
      (like) => like.toString() === req.user
    );

    if (alreadyLiked) {
      confession.likes = confession.likes.filter(
        (like) => like.toString() !== req.user
      );
    } else {
      confession.likes.push(req.user);
    }

    await confession.save();

    const updated = await Confession.findById(confession._id)
      .populate("user", "email")
      .populate("comments.user", "email");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    if (!req.body.text || !req.body.text.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    confession.comments.push({
      user: req.user,
      text: req.body.text,
    });

    await confession.save();

    const updated = await Confession.findById(confession._id)
      .populate("user", "email")
      .populate("comments.user", "email");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:confessionId/comment/:commentId", authMiddleware, async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.confessionId);

    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    const comment = confession.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.deleteOne();
    await confession.save();

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    if (confession.user.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await confession.deleteOne();

    res.json({ message: "Confession deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
