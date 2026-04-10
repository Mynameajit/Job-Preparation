import mongoose, { Document, Schema } from "mongoose";

// ✅ Activity Types (Enum)
export enum ActivityType {
  CODING = "CODING",
  TEST = "TEST",
  RESUME = "RESUME",
  INTERVIEW = "INTERVIEW",
  PROFILE = "PROFILE"
}

// ✅ Interface (TypeScript strong typing)
export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: ActivityType;
  title: string;
  description?: string;
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Schema
const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 fast query for dashboard
    },

    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    meta: {
      type: Schema.Types.Mixed, // flexible data (score, questionId, etc.)
      default: {},
    },
  },
  {
    timestamps: true, // 🔥 auto createdAt & updatedAt
  }
);

// ✅ Index (for faster sorting)
activitySchema.index({ userId: 1, createdAt: -1 });

// ✅ Model
export const ActivityModel = mongoose.models.Activity || mongoose.model<IActivity>("Activity", activitySchema);