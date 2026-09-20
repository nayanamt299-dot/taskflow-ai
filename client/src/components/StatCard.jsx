export default function StatCard({ icon: Icon, label, value, detail, accent="blue" }) {
  return <div className={`stat-card accent-${accent}`}><div className="stat-icon"><Icon size={21}/></div><div className="stat-text"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>;
}
