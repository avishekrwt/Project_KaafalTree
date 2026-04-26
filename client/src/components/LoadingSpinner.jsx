import './LoadingSpinner.css';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-state__spinner" />
      <p>{label}</p>
    </div>
  );
}
