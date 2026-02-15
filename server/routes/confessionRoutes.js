const express = require("express");
const Confession = require("../models/Confession");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE CONFESSION (Protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const confession = await Confession.create({
      text: req.body.text,
      user: req.user,
    });

    res.status(201).json(confession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET ALL CONFESSIONS (Public)
router.get("/", async (req, res) => {
  try {
    const confessions = await Confession.find()
      .sort({ createdAt: -1 });

    res.json(confessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// LIKE / UNLIKE CONFESSION (Protected)
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
      // UNLIKE
      confession.likes = confession.likes.filter(
        (like) => like.toString() !== req.user
      );
    } else {
      // LIKE
      confession.likes.push(req.user);
    }

    await confession.save();
    res.json(confession);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ADD COMMENT (Protected)
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    confession.comments.push({
      user: req.user,
      text: req.body.text,
    });

    await confession.save();
    res.json(confession);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
