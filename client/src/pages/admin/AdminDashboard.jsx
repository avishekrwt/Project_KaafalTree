import { useEffect, useState } from 'react';
import { CalendarDays, Bed, MessageSquare, Star, TrendingUp } from 'lucide-react';
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
        <StatCard label="Total Bookings" value={counts.bookings} icon={<CalendarDays size={24} />} />
        <StatCard label="Total Rooms" value={counts.rooms} icon={<Bed size={24} />} />
        <StatCard label="New Messages" value={counts.messages} icon={<MessageSquare size={24} />} />
        <StatCard label="Pending Testimonials" value={counts.pendingTestimonials} icon={<Star size={24} />} />
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Recent Bookings</h3>
          <div className="admin-card__icon"><TrendingUp size={20} /></div>
        </div>
        <div className="admin-grid">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="admin-recent-booking-item">
              <div className="admin-recent-booking-info">
                <strong>{booking.guestName}</strong>
                <p className="admin-muted">{booking.room?.name || 'Room not selected'} | {booking.checkIn} to {booking.checkOut}</p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
          ))}
          {recentBookings.length === 0 && <p className="admin-muted">No recent bookings found.</p>}
        </div>
      </div>
    </section>
  );
}
