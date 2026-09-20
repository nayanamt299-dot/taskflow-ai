import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  action: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
