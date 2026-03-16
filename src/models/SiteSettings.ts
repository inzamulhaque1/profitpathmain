import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  key: string;
  guestLimit: number;
  userLimit: number;
  taskBonus: number;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  key: { type: String, required: true, unique: true, default: "main" },
  guestLimit: { type: Number, default: 2 },
  userLimit: { type: Number, default: 4 },
  taskBonus: { type: Number, default: 11 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
