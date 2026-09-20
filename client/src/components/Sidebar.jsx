import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, CheckSquare, Sparkles, BarChart3, User, Settings, LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";

const items = [
  ["/app", LayoutDashboard, "Dashboard"],
  ["/app/projects", FolderKanban, "Projects"],
  ["/app/tasks", CheckSquare, "Tasks"],
  ["/app/ai", Sparkles, "AI Assistant"],
  ["/app/analytics", BarChart3, "Analytics"],
  ["/app/profile", User, "Profile"],
  ["/app/settings", Settings, "Settings"]
];

export default function Sidebar({ open, close }) {
  const { logout } = useAuth(); const nav = useNavigate(); const toast = useToast();
  async function signOut() { await logout(); toast.push("Logged out successfully."); nav("/login"); }
  return <aside className={`sidebar ${open ? "open" : ""}`}>
    <div className="brand"><div className="brand-mark">✦</div><div><b>TaskFlow</b><small>AI</small></div><button className="icon-btn mobile-only" onClick={close}><X/></button></div>
    <nav>{items.map(([to, Icon, label]) => <NavLink key={to} to={to} end={to==="/app"} onClick={close}><Icon size={19}/><span>{label}</span></NavLink>)}</nav>
    <button className="logout" onClick={signOut}><LogOut size={19}/> Logout</button>
  </aside>;
}
