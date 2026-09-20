import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return <div className="app-shell"><Sidebar open={open} close={()=>setOpen(false)}/>{open && <div className="overlay" onClick={()=>setOpen(false)}/>}<main className="main"><Navbar openMenu={()=>setOpen(true)} onSearch={q=>{ if(q) nav(`/app/tasks?search=${encodeURIComponent(q)}`); }}/><div className="page"><Outlet/></div></main></div>;
}
