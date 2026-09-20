import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  description: { type: String, default: "", maxlength: 2000 },
  status: { type: String, enum: ["Planning", "Active", "On Hold", "Completed"], default: "Planning" },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  startDate: { type: Date },
  dueDate: { type: Date },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
