import { X } from "lucide-react";
export default function Modal({ open, title, children, onClose, wide=false }) {
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className={`modal ${wide?"modal-wide":""}`}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X/></button></div>{children}</div></div>;
}
