export default function ConfirmModal({ title, message, open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="admin-modal__actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
