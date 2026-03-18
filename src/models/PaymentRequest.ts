import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentRequest extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  bkashNumber: string;
  transactionId: string;
  amount: number;
  couponCode: string;
  status: "pending" | "approved" | "rejected";
  adminNote: string;
  createdAt: Date;
}

const PaymentRequestSchema = new Schema<IPaymentRequest>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  bkashNumber: { type: String, required: true },
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  couponCode: { type: String, default: "" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  adminNote: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PaymentRequest || mongoose.model<IPaymentRequest>("PaymentRequest", PaymentRequestSchema);
