const express = require("express");
const { body, validationResult } = require("express-validator");
const Job = require("../models/Job");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All job routes are protected
router.use(protect);

// GET /jobs — with pagination, filter, search
router.get("/", async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const query = { userId: req.user._id };

    if (status && status !== "All") query.status = status;
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /jobs/stats — dashboard counts
router.get("/stats", async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const result = { Applied: 0, OA: 0, Interview: 0, Offer: 0, Rejected: 0 };
    stats.forEach((s) => {
      if (result.hasOwnProperty(s._id)) result[s._id] = s.count;
    });

    result.total = Object.values(result).reduce((a, b) => a + b, 0);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /jobs
router.post(
  "/",
  [
    body("company").trim().notEmpty().withMessage("Company is required"),
    body("role").trim().notEmpty().withMessage("Role is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const job = await Job.create({ ...req.body, userId: req.user._id });
      res.status(201).json(job);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /jobs/:id
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /jobs/:id
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /jobs/:id/notes — add a note
router.post("/:id/notes", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Note text is required" });
    }
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $push: { notes: { text: text.trim() } } },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /jobs/:id/notes/:noteId
router.delete("/:id/notes/:noteId", async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $pull: { notes: { _id: req.params.noteId } } },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
