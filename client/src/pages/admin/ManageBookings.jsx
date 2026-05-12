import { useEffect, useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import adminApi from '../../services/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import AdminTable from '../../components/admin/AdminTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/admin/ConfirmModal';
import FormModal from '../../components/admin/FormModal';
import './admin.css';

const emptyForm = {
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  checkIn: '',
  checkOut: '',
  numGuests: 1,
  roomId: '',
  status: 'confirmed',
  specialRequests: '',
  totalPrice: '',
};

export default function ManageBookings() {
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState({ loading: true, error: '', data: [], meta: null });
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [rooms, setRooms] = useState([]);

  const loadRooms = async () => {
    try {
      const res = await adminApi.getRooms();
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

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
    const timer = setTimeout(() => load(), 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createBooking({
        ...form,
        roomId: form.roomId ? parseInt(form.roomId) : null,
        totalPrice: form.totalPrice ? parseFloat(form.totalPrice) : null,
        numGuests: parseInt(form.numGuests),
      });
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      alert(err.message || 'Failed to create booking');
    }
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
        <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} />
          Create Booking
        </button>
      </div>

      <div className="admin-controls">
        <div className="admin-search">
          <Search size={18} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search by guest name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="admin-filters">
          <Filter size={18} className="admin-muted" />
          <button className={`admin-filter-btn ${status === '' ? 'active' : ''}`} onClick={() => setStatus('')}>All</button>
          <button className={`admin-filter-btn ${status === 'pending' ? 'active' : ''}`} onClick={() => setStatus('pending')}>Pending</button>
          <button className={`admin-filter-btn ${status === 'confirmed' ? 'active' : ''}`} onClick={() => setStatus('confirmed')}>Confirmed</button>
          <button className={`admin-filter-btn ${status === 'paid' ? 'active' : ''}`} onClick={() => setStatus('paid')}>Paid</button>
          <button className={`admin-filter-btn ${status === 'cancelled' ? 'active' : ''}`} onClick={() => setStatus('cancelled')}>Cancelled</button>
        </div>
      </div>

      <AdminTable
        rows={state.data.filter(b => b.guestName.toLowerCase().includes(searchTerm.toLowerCase()))}
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

      <FormModal
        open={modalOpen}
        title="Create Booking"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-grid admin-grid--two">
            <label className="admin-field">
              <span>Guest Name *</span>
              <input type="text" required value={form.guestName} onChange={e => setForm({ ...form, guestName: e.target.value })} />
            </label>
            <label className="admin-field">
              <span>Guest Email *</span>
              <input type="email" required value={form.guestEmail} onChange={e => setForm({ ...form, guestEmail: e.target.value })} />
            </label>
            <label className="admin-field">
              <span>Guest Phone *</span>
              <input type="tel" required value={form.guestPhone} onChange={e => setForm({ ...form, guestPhone: e.target.value })} />
            </label>
            <label className="admin-field">
              <span>Number of Guests *</span>
              <input type="number" min="1" required value={form.numGuests} onChange={e => setForm({ ...form, numGuests: e.target.value })} />
            </label>
            <label className="admin-field">
              <span>Check-In Date *</span>
              <input type="date" required value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} />
            </label>
            <label className="admin-field">
              <span>Check-Out Date *</span>
              <input type="date" required value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} />
            </label>
            <label className="admin-field">
              <span>Room</span>
              <select value={form.roomId} onChange={e => setForm({ ...form, roomId: e.target.value })}>
                <option value="">No Room Selected</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name} (₹{room.pricePerNight}/night)</option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Status *</span>
              <select required value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="paid">Paid</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Total Price (₹)</span>
              <input type="number" min="0" step="0.01" value={form.totalPrice} onChange={e => setForm({ ...form, totalPrice: e.target.value })} placeholder="Auto-calculated if left blank" />
            </label>
          </div>
          <label className="admin-field" style={{ marginTop: '16px' }}>
            <span>Special Requests</span>
            <textarea value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} rows="3"></textarea>
          </label>
          <div className="admin-modal__actions">
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Booking</button>
          </div>
        </form>
      </FormModal>
    </section>
  );
}
