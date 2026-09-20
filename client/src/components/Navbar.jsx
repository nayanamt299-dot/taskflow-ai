import { Bell, Menu, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ openMenu, onSearch }) {
  const { user } = useAuth();
  return <header className="navbar">
    <button className="icon-btn mobile-only" onClick={openMenu}><Menu/></button>
    <div className="global-search"><Search size={18}/><input placeholder="Search projects, tasks..." onChange={e=>onSearch?.(e.target.value)}/></div>
    <div className="nav-right"><button className="icon-btn"><Bell size={20}/><i/></button><div className="avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div><div className="user-mini"><b>{user?.name}</b><span>{user?.email}</span></div></div>
  </header>;
}
