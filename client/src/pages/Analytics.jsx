import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import api from "../services/api";
import { PageTitle } from "./Dashboard";
import { LoadingSkeleton, ErrorState } from "../components/UI";

export default function Analytics(){
 const [stats,setStats]=useState(null),[error,setError]=useState("");
 async function load(){try{setStats((await api.get("/dashboard/stats")).data.stats)}catch(e){setError(e.message)}}useEffect(()=>{load()},[]);
 if(error)return <ErrorState message={error} retry={load}/>;if(!stats)return <LoadingSkeleton count={4}/>;
 return <><PageTitle title="Analytics" subtitle="Understand workload, completion and priority distribution."/><div className="analytics-grid"><section className="chart-card"><div className="chart-title"><div><span className="eyebrow">Task status</span><h3>Workload distribution</h3></div><BarChart3/></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={stats.statusDistribution}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="value" radius={[8,8,0,0]} fill="#38bdf8"/></BarChart></ResponsiveContainer></div></section><section className="chart-card"><div className="chart-title"><div><span className="eyebrow">Priorities</span><h3>Priority distribution</h3></div></div><div className="chart-wrap"><ResponsiveContainer><PieChart><Pie data={stats.priorityDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={105} label>{stats.priorityDistribution.map((_,i)=><Cell key={i} fill={["#bae6fd","#93c5fd","#f9a8d4","#fb7185"][i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></section></div><div className="analytics-kpis"><div><span>Completion rate</span><strong>{stats.completionRate}%</strong></div><div><span>Total projects</span><strong>{stats.totalProjects}</strong></div><div><span>Tasks completed</span><strong>{stats.completedTasks}</strong></div><div><span>Urgent tasks</span><strong>{stats.urgentTasks}</strong></div></div><p className="analytics-note">Charts are calculated from your current MongoDB data, so they update as you create, complete and delete tasks.</p></>;
}
