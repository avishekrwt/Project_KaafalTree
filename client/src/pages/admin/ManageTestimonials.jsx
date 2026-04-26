import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/admin/StatusBadge';
import './admin.css';

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ guestName: '', reviewText: '', rating: 5, isApproved: false });

  const load = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getTestimonials();
      setTestimonials(response.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    await adminApi.createTestimonial(form);
    setForm({ guestName: '', reviewText: '', rating: 5, isApproved: false });
    load();
  };

  if (loading) return <LoadingSpinner label="Loading testimonials..." />;
  if (error) return <ErrorMessage message={error} actionLabel="Retry" onAction={load} />;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Testimonials</h1>
          <p>Approve or remove guest reviews shown on the public site.</p>
        </div>
      </div>

      <form className="admin-card" onSubmit={create}>
        <label className="admin-field"><span>Guest name</span><input value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} required /></label>
        <label className="admin-field"><span>Review text</span><textarea value={form.reviewText} onChange={(e) => setForm({ ...form, reviewText: e.target.value })} required /></label>
        <div className="admin-inline">
          <label className="admin-field" style={{ flex: 1 }}><span>Rating</span><input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></label>
          <label className="admin-inline"><input type="checkbox" checked={form.isApproved} onChange={(e) => setForm({ ...form, isApproved: e.target.checked })} /><span>Approved</span></label>
        </div>
        <button type="submit" className="btn btn-primary">Add Testimonial</button>
      </form>

      <div className="admin-grid">
        {testimonials.map((testimonial) => (
          <article key={testimonial.id} className="admin-card">
            <div className="admin-page__header">
              <div>
                <h3>{testimonial.guestName}</h3>
                <p className="admin-muted">{'★'.repeat(testimonial.rating)}</p>
              </div>
              <StatusBadge status={testimonial.isApproved ? 'paid' : 'pending'} />
            </div>
            <p>{testimonial.reviewText}</p>
            <div className="admin-actions">
              <button type="button" className="btn btn-outline" onClick={() => adminApi.updateTestimonial(testimonial.id, { isApproved: !testimonial.isApproved }).then(load)}>
                {testimonial.isApproved ? 'Unapprove' : 'Approve'}
              </button>
              <button type="button" className="btn btn-primary" onClick={() => adminApi.deleteTestimonial(testimonial.id).then(load)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
