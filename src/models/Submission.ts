import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;

  code: string;
  language: string;

  status: "accepted" | "wrong" | "pending";

  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    code: String,

    language: String,

    status: {
      type: String,
      enum: ["accepted", "wrong", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Submission ||
  model<ISubmission>("Submission", SubmissionSchema);