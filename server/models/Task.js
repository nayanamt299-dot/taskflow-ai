import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
  description: { type: String, default: "", maxlength: 3000 },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["Todo", "In Progress", "Done"], default: "Todo" },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  dueDate: { type: Date }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
