import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { getImageUrl } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import ImageUpload from '../../components/admin/ImageUpload';
import './admin.css';

export default function ManageGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ altText: '', category: 'Property', imageUrl: '', displayOrder: 0, image: null });

  const load = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getGallery();
      setGallery(response.data);
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
    await adminApi.createGalleryImage(form);
    setForm({ altText: '', category: 'Property', imageUrl: '', displayOrder: 0, image: null });
    load();
  };

  if (loading) return <LoadingSpinner label="Loading gallery..." />;
  if (error) return <ErrorMessage message={error} actionLabel="Retry" onAction={load} />;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Gallery</h1>
          <p>Add and maintain image assets used across the property gallery.</p>
        </div>
      </div>

      <form className="admin-card" onSubmit={create}>
        <div className="admin-grid admin-grid--two">
          <label className="admin-field"><span>Alt text</span><input value={form.altText} onChange={(e) => setForm({ ...form, altText: e.target.value })} required /></label>
          <label className="admin-field"><span>Category</span><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Property</option><option>Rooms</option><option>Restaurant</option><option>Surroundings</option></select></label>
          <label className="admin-field"><span>Display order</span><input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} /></label>
          <label className="admin-field"><span>Image URL</span><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
        </div>
        <ImageUpload label="Upload image" name="image" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
        <button type="submit" className="btn btn-primary">Add Image</button>
      </form>

      <div className="admin-grid admin-grid--two">
        {gallery.map((image) => (
          <article key={image.id} className="admin-card">
            <img src={getImageUrl(image.imageUrl)} alt={image.altText} style={{ borderRadius: '14px', aspectRatio: '4 / 3', objectFit: 'cover', marginBottom: '14px' }} />
            <h3>{image.altText}</h3>
            <p className="admin-muted">{image.category}</p>
            <div className="admin-actions">
              <button type="button" className="btn btn-outline" onClick={() => {
                const altText = window.prompt('Alt text', image.altText);
                if (altText) {
                  adminApi.updateGalleryImage(image.id, { altText, category: image.category, displayOrder: image.displayOrder }).then(load);
                }
              }}>Edit</button>
              <button type="button" className="btn btn-primary" onClick={() => adminApi.deleteGalleryImage(image.id).then(load)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
