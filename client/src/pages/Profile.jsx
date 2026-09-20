import { useEffect, useState } from "react";
import { UserRound, ShieldCheck } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { PageTitle } from "./Dashboard";
import { Button, Input } from "../components/UI";
import { useToast } from "../components/Toast";

export default function Profile(){
 const {user,refreshUser}=useAuth();const toast=useToast();const [form,setForm]=useState({name:"",email:""});const [pw,setPw]=useState({currentPassword:"",newPassword:""});const [saving,setSaving]=useState(false);
 useEffect(()=>{if(user)setForm({name:user.name,email:user.email})},[user]);
 async function save(e){e.preventDefault();setSaving(true);try{await api.put(`/users/${user.id}`,form);await refreshUser();toast.push("Profile updated")}catch(e){toast.push(e.message,"error")}finally{setSaving(false)}}
 async function password(e){e.preventDefault();setSaving(true);try{await api.put(`/users/${user.id}`,pw);setPw({currentPassword:"",newPassword:""});toast.push("Password changed")}catch(e){toast.push(e.message,"error")}finally{setSaving(false)}}
 return <><PageTitle title="Profile" subtitle="Manage your account information and security."/><div className="profile-grid"><section className="panel profile-card"><div className="large-avatar">{user?.name?.[0]}</div><h2>{user?.name}</h2><p>{user?.email}</p><span className="verified"><ShieldCheck size={16}/> Account secured</span></section><section className="panel"><div className="panel-head"><div><span className="eyebrow">Account</span><h3>Personal information</h3></div><UserRound/></div><form className="form-grid" onSubmit={save}><Input label="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><Button loading={saving}>Save profile</Button></form><hr/><h3>Change password</h3><form className="form-grid" onSubmit={password}><Input label="Current password" type="password" value={pw.currentPassword} onChange={e=>setPw({...pw,currentPassword:e.target.value})}/><Input label="New password" type="password" value={pw.newPassword} onChange={e=>setPw({...pw,newPassword:e.target.value})}/><Button variant="secondary" loading={saving}>Update password</Button></form></section></div></>;
}
