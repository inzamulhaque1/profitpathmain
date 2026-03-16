import mongoose, { Schema, Document } from "mongoose";

export interface ISavedGeneration extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  toolSlug: string;
  data: Record<string, unknown>;
  inputs: Record<string, unknown>;
  createdAt: Date;
}

const SavedGenerationSchema = new Schema<ISavedGeneration>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  toolSlug: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  inputs: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

SavedGenerationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.SavedGeneration || mongoose.model<ISavedGeneration>("SavedGeneration", SavedGenerationSchema);
