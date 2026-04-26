import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import AdminTable from '../../components/admin/AdminTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/admin/ConfirmModal';
import './admin.css';

export default function ManageBookings() {
  const [status, setStatus] = useState('');
  const [state, setState] = useState({ loading: true, error: '', data: [], meta: null });
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await adminApi.getBookings(status ? { status } : {});
      setState({ loading: false, error: '', data: response.data, meta: response.meta });
    } catch (error) {
      setState({ loading: false, error: error.message, data: [], meta: null });
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const updateStatus = async (id, nextStatus) => {
    await adminApi.updateBooking(id, { status: nextStatus });
    load();
  };

  const confirmDelete = async () => {
    await adminApi.deleteBooking(deletingId);
    setDeletingId(null);
    load();
  };

  if (state.loading) return <LoadingSpinner label="Loading bookings..." />;
  if (state.error) return <ErrorMessage message={state.error} actionLabel="Retry" onAction={load} />;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Bookings</h1>
          <p>Review guest inquiries, payment-backed bookings, and stay status updates.</p>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <AdminTable
        rows={state.data}
        columns={[
          { key: 'guestName', label: 'Guest' },
          { key: 'room', label: 'Room', render: (row) => row.room?.name || 'Not selected' },
          { key: 'dates', label: 'Dates', render: (row) => `${row.checkIn} → ${row.checkOut}` },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="admin-actions">
                <button type="button" className="btn btn-outline" onClick={() => updateStatus(row.id, 'confirmed')}>Confirm</button>
                <button type="button" className="btn btn-outline" onClick={() => updateStatus(row.id, 'paid')}>Mark Paid</button>
                <button type="button" className="btn btn-outline" onClick={() => updateStatus(row.id, 'cancelled')}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => setDeletingId(row.id)}>Delete</button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmModal
        open={Boolean(deletingId)}
        title="Delete booking"
        message="This booking will be permanently removed."
        onCancel={() => setDeletingId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
