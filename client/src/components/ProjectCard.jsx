import { CalendarDays, CheckCircle2, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, ProgressBar } from "./UI";

export default function ProjectCard({ project, onEdit, onDelete }) {
  return <article className="project-card">
    <div className="card-top"><Badge>{project.status}</Badge><button className="icon-btn"><MoreHorizontal size={19}/></button></div>
    <Link to={`/app/projects/${project._id}`}><h3>{project.name}</h3></Link>
    <p>{project.description || "No description added yet."}</p>
    <div className="project-meta"><Badge tone={`priority-${project.priority.toLowerCase()}`}>{project.priority}</Badge><span><CheckCircle2 size={15}/> {project.completedTasks}/{project.taskCount} tasks</span></div>
    <ProgressBar value={project.progress}/>
    <div className="progress-label"><span>Progress</span><b>{project.progress}%</b></div>
    <div className="card-footer"><span><CalendarDays size={15}/> {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No due date"}</span><div><button className="text-btn" onClick={()=>onEdit(project)}>Edit</button><button className="text-btn danger-text" onClick={()=>onDelete(project._id)}>Delete</button></div></div>
  </article>;
}
