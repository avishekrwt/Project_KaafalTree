export default function StatCard({ label, value, hint, icon }) {
  return (
    <div className="admin-card admin-stat group hover:-translate-y-1 transition-all duration-300">
      <div className="admin-stat__header">
        <div className="admin-stat__icon-wrapper group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <p className="admin-stat__label">{label}</p>
      </div>
      <div className="admin-stat__content">
        <h3 className="admin-stat__value">{value}</h3>
        {hint ? <p className="admin-stat__hint">{hint}</p> : null}
      </div>
    </div>
  );
}
