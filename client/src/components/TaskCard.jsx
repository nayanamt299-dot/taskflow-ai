import { Calendar, UserRound } from "lucide-react";
import { Badge } from "./UI";

export default function TaskCard({ task, onStatus, onEdit, onDelete, draggable=false }) {
  return <article className="task-card" draggable={draggable} onDragStart={e=>e.dataTransfer.setData("taskId", task._id)}>
    <div className="task-card-top"><Badge tone={`priority-${(task.priority||"Medium").toLowerCase()}`}>{task.priority}</Badge><span className={`status-dot status-${task.status.replace(" ","-").toLowerCase()}`}/></div>
    <h4>{task.title}</h4><p>{task.description || "No description."}</p>
    <div className="task-project">{task.project?.name || "Project"}</div>
    <div className="task-footer"><span><Calendar size={14}/> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</span>{task.assignedTo && <span><UserRound size={14}/> {task.assignedTo.name}</span>}</div>
    <div className="task-actions">
      <select value={task.status} onChange={e=>onStatus(task._id,e.target.value)}><option>Todo</option><option>In Progress</option><option>Done</option></select>
      <button className="text-btn" onClick={()=>onEdit(task)}>Edit</button><button className="text-btn danger-text" onClick={()=>onDelete(task._id)}>Delete</button>
    </div>
  </article>;
}
