import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon {
  code: string;
  discount: number;
  firstMonthOnly: boolean;
  enabled: boolean;
}

export interface ISiteSettings extends Document {
  key: string;
  guestLimit: number;
  userLimit: number;
  taskBonus: number;
  proPrice: number;
  bkashNumber: string;
  coupons: ICoupon[];
  updatedAt: Date;
}

const CouponSchema = new Schema({
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  firstMonthOnly: { type: Boolean, default: true },
  enabled: { type: Boolean, default: true },
}, { _id: false });

const SiteSettingsSchema = new Schema<ISiteSettings>({
  key: { type: String, required: true, unique: true, default: "main" },
  guestLimit: { type: Number, default: 2 },
  userLimit: { type: Number, default: 4 },
  taskBonus: { type: Number, default: 11 },
  proPrice: { type: Number, default: 200 },
  bkashNumber: { type: String, default: "01728005274" },
  coupons: { type: [CouponSchema], default: [{ code: "new50", discount: 50, firstMonthOnly: true, enabled: true }] },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
