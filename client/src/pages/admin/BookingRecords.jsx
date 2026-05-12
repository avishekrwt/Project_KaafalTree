import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import adminApi from '../../services/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/admin/ConfirmModal';
import './admin.css';

const todayStr = () => new Date().toISOString().split('T')[0];

function isToday(dateStr) {
  return dateStr === todayStr();
}

export default function BookingRecords() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      // Load confirmed + paid bookings only
      const [confirmed, paid] = await Promise.all([
        adminApi.getBookings({ status: 'confirmed', limit: 100 }),
        adminApi.getBookings({ status: 'paid', limit: 100 }),
      ]);
      const all = [...confirmed.data, ...paid.data];
      // Sort: today's first, then by check-in date desc
      all.sort((a, b) => {
        const todayDate = todayStr();
        const aIsToday = a.checkIn === todayDate ? 0 : 1;
        const bIsToday = b.checkIn === todayDate ? 0 : 1;
        if (aIsToday !== bIsToday) return aIsToday - bIsToday;
        return new Date(b.checkIn) - new Date(a.checkIn);
      });
      setBookings(all);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, nextStatus) => {
    await adminApi.updateBooking(id, { status: nextStatus });
    load();
  };

  const confirmDelete = async () => {
    await adminApi.deleteBooking(deletingId);
    setDeletingId(null);
    load();
  };

  if (loading) return <LoadingSpinner label="Loading booking records..." />;
  if (error) return <ErrorMessage message={error} actionLabel="Retry" onAction={load} />;

  const today = todayStr();
  const todayBookings = bookings.filter(b => b.checkIn === today);
  const pastBookings = bookings.filter(b => b.checkIn < today);
  const futureBookings = bookings.filter(b => b.checkIn > today);

  const BookingRow = ({ booking, editable }) => (
    <article
      className="admin-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        alignItems: 'start',
        opacity: editable ? 1 : 0.65,
        marginBottom: 0,
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <strong style={{ fontSize: '16px', color: 'var(--admin-text)' }}>{booking.guestName}</strong>
          <StatusBadge status={booking.status} />
          {!editable && (
            <span style={{ fontSize: '11px', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '2px 8px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Past — Read Only
            </span>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            📅 Check-in: <strong style={{ color: 'var(--admin-text)' }}>{booking.checkIn}</strong>
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            📅 Check-out: <strong style={{ color: 'var(--admin-text)' }}>{booking.checkOut}</strong>
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            🛏 Room: <strong style={{ color: 'var(--admin-text)' }}>{booking.room?.name || 'Not assigned'}</strong>
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            👥 Guests: <strong style={{ color: 'var(--admin-text)' }}>{booking.numGuests}</strong>
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            📞 {booking.guestPhone}
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            ✉️ {booking.guestEmail}
          </p>
        </div>
        {booking.specialRequests && (
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
            Note: {booking.specialRequests}
          </p>
        )}
      </div>
      {editable && (
        <div className="admin-actions" style={{ flexDirection: 'column', gap: '8px' }}>
          {booking.status !== 'paid' && (
            <button type="button" className="btn btn-outline" onClick={() => updateStatus(booking.id, 'paid')}>
              Mark Paid
            </button>
          )}
          {booking.status !== 'confirmed' && (
            <button type="button" className="btn btn-outline" onClick={() => updateStatus(booking.id, 'confirmed')}>
              Confirm
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={() => setDeletingId(booking.id)}>
            Delete
          </button>
        </div>
      )}
    </article>
  );

  const Section = ({ title, items, editable, emptyMsg }) => (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--admin-border)' }}>
        {title} <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: 400 }}>({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', fontStyle: 'italic' }}>{emptyMsg}</p>
      ) : (
        <div className="admin-grid" style={{ gap: '12px' }}>
          {items.map(b => <BookingRow key={b.id} booking={b} editable={editable} />)}
        </div>
      )}
    </div>
  );

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Booking Records</h1>
          <p>Historical log of all confirmed and paid bookings. Only today&apos;s check-ins can be modified.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
          <BookOpen size={16} />
          Today: {today}
        </div>
      </div>

      <div className="admin-grid" style={{ gap: '40px' }}>
        <Section
          title="🟢 Today's Check-ins"
          items={todayBookings}
          editable={true}
          emptyMsg="No bookings checking in today."
        />
        <Section
          title="🔵 Upcoming Bookings"
          items={futureBookings}
          editable={true}
          emptyMsg="No upcoming confirmed bookings."
        />
        <Section
          title="🔒 Past Bookings (Read Only)"
          items={pastBookings}
          editable={false}
          emptyMsg="No past booking records found."
        />
      </div>

      <ConfirmModal
        open={Boolean(deletingId)}
        title="Delete booking record"
        message="This booking record will be permanently removed."
        onCancel={() => setDeletingId(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
