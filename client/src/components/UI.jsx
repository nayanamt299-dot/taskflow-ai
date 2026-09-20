import { Loader2, SearchX } from "lucide-react";

export function Button({ children, variant="primary", loading=false, ...props }) {
  return <button className={`btn btn-${variant}`} disabled={loading || props.disabled} {...props}>
    {loading && <Loader2 className="spin" size={17}/>} {children}
  </button>;
}
export function Input({ label, ...props }) {
  return <label className="field">{label && <span>{label}</span>}<input {...props}/></label>;
}
export function Textarea({ label, ...props }) {
  return <label className="field">{label && <span>{label}</span>}<textarea {...props}/></label>;
}
export function Select({ label, children, ...props }) {
  return <label className="field">{label && <span>{label}</span>}<select {...props}>{children}</select></label>;
}
export function Badge({ children, tone="" }) { return <span className={`badge ${tone}`}>{children}</span>; }
export function ProgressBar({ value=0 }) { return <div className="progress"><span style={{width:`${Math.min(100, Math.max(0,value))}%`}}/></div>; }
export function LoadingSkeleton({ count=3 }) { return <div className="skeleton-list">{Array.from({length:count},(_,i)=><div className="skeleton" key={i}/>)}</div>; }
export function EmptyState({ title="Nothing here yet", description="Create your first item to get started." }) { return <div className="empty-state"><SearchX size={34}/><h3>{title}</h3><p>{description}</p></div>; }
export function ErrorState({ message="Unable to load this content.", retry }) { return <div className="error-state"><h3>Something went wrong</h3><p>{message}</p>{retry && <Button variant="secondary" onClick={retry}>Try again</Button>}</div>; }
