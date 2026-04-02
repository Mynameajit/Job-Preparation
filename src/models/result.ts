import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },

    answers: {
      type: Object, // {0: "A", 1: "B"}
    },

    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    wrongAnswers: Number,

    timeTaken: Number,

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Result ||
  mongoose.model("Result", resultSchema);