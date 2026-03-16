import mongoose, { Schema, Document } from "mongoose";

export interface IPromo extends Document {
  order: number; // Position in list (0, 1, 2, ...)
  title: string;
  description: string;
  promoUrl: string;
  promoLabel: string;
  timerDuration: number;
  enabled: boolean;
  createdAt: Date;
}

const PromoSchema = new Schema<IPromo>({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  promoUrl: { type: String, default: "" },
  promoLabel: { type: String, default: "" },
  timerDuration: { type: Number, default: 15 },
  enabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Clear old model if it exists (hot reload)
if (mongoose.models.DailyTask) {
  delete mongoose.models.DailyTask;
}
if (mongoose.models.Promo) {
  delete mongoose.models.Promo;
}

export default mongoose.model<IPromo>("Promo", PromoSchema);
