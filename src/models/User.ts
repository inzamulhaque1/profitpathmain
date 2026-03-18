import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  dailyGenerations: number;
  lastGenerationDate: string;
  tasksCompletedToday: number;
  lastTaskDate: string;
  nextPromoIndex: number;
  referralCode: string;
  referralCount: number;
  rejectedReferrals: number;
  referredBy: string;
  unlimitedUntil: Date | null;
  lastLoginIP: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  dailyGenerations: { type: Number, default: 0 },
  lastGenerationDate: { type: String, default: "" },
  tasksCompletedToday: { type: Number, default: 0 },
  lastTaskDate: { type: String, default: "" },
  nextPromoIndex: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, sparse: true },
  referralCount: { type: Number, default: 0 },
  rejectedReferrals: { type: Number, default: 0 },
  referredBy: { type: String, default: "" },
  unlimitedUntil: { type: Date, default: null },
  lastLoginIP: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
