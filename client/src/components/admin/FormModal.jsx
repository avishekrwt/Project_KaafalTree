export default function FormModal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal admin-modal--large">
        <div className="admin-modal__header">
          <h3>{title}</h3>
          <button type="button" className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
