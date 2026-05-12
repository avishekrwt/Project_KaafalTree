import { useEffect, useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  checkIn: null,
  checkOut: null,
  numGuests: 1,
  roomId: '',
  status: 'confirmed',
  specialRequests: '',
};

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

export default function ManageBookings() {
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState({ loading: true, error: '', data: [], meta: null });
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState([]);
  const [rooms, setRooms] = useState([]);

  const loadRooms = async () => {
    try {
      const res = await adminApi.getRooms();
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    }
  };

  useEffect(() => { loadRooms(); }, []);

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

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setFormErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);

    // Validate
    const errors = [];
    if (!validateEmail(form.guestEmail)) {
      errors.push('Please enter a valid email address.');
    }
    if (!validatePhone(form.guestPhone)) {
      errors.push('Phone number must be exactly 10 digits (numbers only, no country code).');
    }
    if (!form.checkIn || !form.checkOut) {
      errors.push('Please select both check-in and check-out dates.');
    }
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await adminApi.createBooking({
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
        checkIn: formatDate(form.checkIn),
        checkOut: formatDate(form.checkOut),
        numGuests: parseInt(form.numGuests),
        roomId: form.roomId ? parseInt(form.roomId) : null,
        status: form.status,
        specialRequests: form.specialRequests || null,
      });
      closeModal();
      load();
    } catch (err) {
      setFormErrors([err.message || 'Failed to create booking. Please try again.']);
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

      <FormModal open={modalOpen} title="Create Booking" onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          {formErrors.length > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
              {formErrors.map((err, i) => (
                <p key={i} style={{ color: '#f87171', margin: '0 0 4px', fontSize: '14px' }}>{err}</p>
              ))}
            </div>
          )}

          <div className="admin-grid admin-grid--two">
            <label className="admin-field">
              <span>Guest Name *</span>
              <input type="text" required value={form.guestName} onChange={e => setForm({ ...form, guestName: e.target.value })} />
            </label>

            <label className="admin-field">
              <span>Guest Email *</span>
              <input
                type="email"
                required
                placeholder="guest@example.com"
                value={form.guestEmail}
                onChange={e => setForm({ ...form, guestEmail: e.target.value })}
              />
            </label>

            <label className="admin-field">
              <span>Phone * <span style={{ fontWeight: 400, color: 'var(--admin-text-muted)' }}>(10 digits only)</span></span>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="9876543210"
                value={form.guestPhone}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setForm({ ...form, guestPhone: val });
                }}
              />
            </label>

            <label className="admin-field">
              <span>Number of Guests *</span>
              <input type="number" min="1" max="20" required value={form.numGuests} onChange={e => setForm({ ...form, numGuests: e.target.value })} />
            </label>

            <div className="admin-field">
              <span>Check-In Date *</span>
              <DatePicker
                selected={form.checkIn}
                onChange={(date) => setForm({ ...form, checkIn: date })}
                selectsStart
                startDate={form.checkIn}
                endDate={form.checkOut}
                minDate={new Date()}
                placeholderText="Select check-in date"
                className="admin-field-input"
                required
              />
            </div>

            <div className="admin-field">
              <span>Check-Out Date *</span>
              <DatePicker
                selected={form.checkOut}
                onChange={(date) => setForm({ ...form, checkOut: date })}
                selectsEnd
                startDate={form.checkIn}
                endDate={form.checkOut}
                minDate={form.checkIn || new Date()}
                placeholderText="Select check-out date"
                className="admin-field-input"
                required
              />
            </div>

            <label className="admin-field">
              <span>Room</span>
              <select value={form.roomId} onChange={e => setForm({ ...form, roomId: e.target.value })}>
                <option value="">No Room Selected</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
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
          </div>

          <label className="admin-field" style={{ marginTop: '16px' }}>
            <span>Special Requests</span>
            <textarea value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} rows="3"></textarea>
          </label>

          <div className="admin-modal__actions">
            <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Booking</button>
          </div>
        </form>
      </FormModal>
    </section>
  );
}
