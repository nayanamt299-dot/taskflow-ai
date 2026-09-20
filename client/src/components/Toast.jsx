import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setItems(v => [...v, { id, message, type }]);
    setTimeout(() => setItems(v => v.filter(x => x.id !== id)), 3500);
  };
  const value = useMemo(() => ({ push }), []);
  return <ToastContext.Provider value={value}>{children}
    <div className="toast-stack">
      {items.map(t => <div className={`toast toast-${t.type}`} key={t.id}>
        {t.type === "success" ? <CheckCircle2/> : t.type === "error" ? <XCircle/> : <Info/>}
        <span>{t.message}</span><button onClick={() => setItems(v => v.filter(x => x.id !== t.id))}><X size={16}/></button>
      </div>)}
    </div>
  </ToastContext.Provider>;
}
export const useToast = () => useContext(ToastContext);
