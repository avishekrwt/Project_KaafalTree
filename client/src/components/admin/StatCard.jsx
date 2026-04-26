export default function StatCard({ label, value, hint }) {
  return (
    <div className="admin-card admin-stat">
      <p className="admin-stat__label">{label}</p>
      <h3>{value}</h3>
      {hint ? <p className="admin-stat__hint">{hint}</p> : null}
    </div>
  );
}
