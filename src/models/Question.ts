import mongoose, { Schema, models, model } from "mongoose";

const QuestionSchema = new Schema(
  {
    title: { type: String, required: true },

    slug: { type: String, required: true, unique: true },

    description: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    category: { type: String, required: true },

    type: {
      type: String,
      enum: ["practice", "test"],
      required: true,
    },

    // ✅ Examples
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],

    // ✅ Coding
    testCases: [
      {
        input: String,
        output: String,
      },
    ],

    starterCode: {
      javascript: String,
      python: String,
      java: String,
    },

    options: [String],
    correctAnswer: String,
  },
  { timestamps: true }
);

export default models.Question || model("Question", QuestionSchema);