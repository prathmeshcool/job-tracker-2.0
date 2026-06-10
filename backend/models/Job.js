const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Applied", "OA", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    location: { type: String, trim: true, default: "" },
    jobLink: { type: String, trim: true, default: "" },
    salary: { type: String, trim: true, default: "" },
    resumeVersion: { type: String, trim: true, default: "" },
    dateApplied: { type: Date, default: Date.now },
    notes: [noteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
