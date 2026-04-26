export default function StatusBadge({ status }) {
  return <span className={`admin-badge admin-badge--${String(status).toLowerCase()}`}>{status}</span>;
}
