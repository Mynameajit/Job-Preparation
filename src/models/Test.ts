import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    tag: String,

    type: {
      type: String,
      enum: ["practice", "mock"],
      default: "mock",
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    totalQuestions: Number,

    duration: {
      type: Number, // minutes
      required: true,
    },

    totalMarks: Number,
    negativeMarks: Number,

    isActive: {
      type: Boolean,
      default: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    lastDate: {
      type: Date,
    },

    startTime: Date,
    endTime: Date,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Test || mongoose.model("Test", testSchema);