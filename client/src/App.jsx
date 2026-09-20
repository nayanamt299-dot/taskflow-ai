import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing";
import { Login, Register } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import AI from "./pages/AI";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export default function App(){return <BrowserRouter><AuthProvider><ToastProvider><Routes>
<Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
<Route element={<ProtectedRoute/>}><Route path="/app" element={<AppLayout/>}><Route index element={<Dashboard/>}/><Route path="projects" element={<Projects/>}/><Route path="projects/:id" element={<ProjectDetails/>}/><Route path="tasks" element={<Tasks/>}/><Route path="ai" element={<AI/>}/><Route path="analytics" element={<Analytics/>}/><Route path="profile" element={<Profile/>}/><Route path="settings" element={<Settings/>}/></Route></Route>
<Route path="/404" element={<NotFound/>}/><Route path="*" element={<NotFound/>}/><Route path="/dashboard" element={<Navigate to="/app" replace/>}/>
</Routes></ToastProvider></AuthProvider></BrowserRouter>}
