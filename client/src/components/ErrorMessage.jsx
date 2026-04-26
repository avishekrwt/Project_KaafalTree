import './ErrorMessage.css';

export default function ErrorMessage({ message, actionLabel, onAction }) {
  return (
    <div className="error-state" role="alert">
      <p>{message || 'Something went wrong.'}</p>
      {actionLabel && onAction ? (
        <button type="button" className="btn btn-outline" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
