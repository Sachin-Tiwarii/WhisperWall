const express = require("express");
const Report = require("../models/Report");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/post/:id", authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Reason required" });
    }

    await Report.create({
      post: req.params.id,
      reportedBy: req.user,
      reason,
      type: "post",
    });

    res.json({ message: "Reported successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/comment/:postId/:commentId", authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Reason required" });
    }

    await Report.create({
      post: req.params.postId,
      reportedBy: req.user,
      reason,
      type: "comment",
    });

    res.json({ message: "Reported successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
