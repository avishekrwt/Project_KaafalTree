export default function FormModal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--large" onClick={e => e.stopPropagation()}>
        <div className="admin-modal__header" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <button type="button" className="btn btn-outline" style={{ flexShrink: 0 }} onClick={onClose}>✕ Close</button>
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}
