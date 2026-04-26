import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import './admin.css';

export default function AdminDashboard() {
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    adminApi.getStats()
      .then((response) => setState({ loading: false, error: '', data: response.data }))
      .catch((error) => setState({ loading: false, error: error.message, data: null }));
  }, []);

  if (state.loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (state.error) return <ErrorMessage message={state.error} />;

  const { counts, recentBookings } = state.data;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of the property workflow and latest guest activity.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid--cards">
        <StatCard label="Bookings" value={counts.bookings} />
        <StatCard label="Rooms" value={counts.rooms} />
        <StatCard label="Messages" value={counts.messages} />
        <StatCard label="Pending Testimonials" value={counts.pendingTestimonials} />
      </div>

      <div className="admin-card">
        <h3>Recent Bookings</h3>
        <div className="admin-grid">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="admin-inline" style={{ justifyContent: 'space-between' }}>
              <div>
                <strong>{booking.guestName}</strong>
                <p className="admin-muted">{booking.room?.name || 'Room not selected'} | {booking.checkIn} to {booking.checkOut}</p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
