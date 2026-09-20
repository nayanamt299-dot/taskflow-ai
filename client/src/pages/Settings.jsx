import { useEffect, useState } from "react";
import { Moon, Bell, Shield } from "lucide-react";
import { PageTitle } from "./Dashboard";
import { useToast } from "../components/Toast";
import { Button } from "../components/UI";

export default function Settings(){
 const toast=useToast();const [dark,setDark]=useState(localStorage.getItem("taskflow-theme")==="dark");const [notifications,setNotifications]=useState(true);
 useEffect(()=>{document.documentElement.dataset.theme=dark?"dark":"light";localStorage.setItem("taskflow-theme",dark?"dark":"light")},[dark]);
 return <><PageTitle title="Settings" subtitle="Personalize your TaskFlow AI workspace."/><div className="settings-list"><div className="setting-row"><div className="setting-icon"><Moon/></div><div><b>Theme</b><p>Switch between light and dark appearance.</p></div><button className={`switch ${dark?"on":""}`} onClick={()=>setDark(!dark)}><i/></button></div><div className="setting-row"><div className="setting-icon"><Bell/></div><div><b>Notifications</b><p>Allow workspace activity notifications.</p></div><button className={`switch ${notifications?"on":""}`} onClick={()=>setNotifications(!notifications)}><i/></button></div><div className="setting-row"><div className="setting-icon"><Shield/></div><div><b>Security</b><p>Authentication uses hashed passwords and protected sessions.</p></div><span className="security-pill">Protected</span></div></div><Button variant="secondary" onClick={()=>toast.push("Settings are saved automatically.")}>Save preferences</Button></>;
}
