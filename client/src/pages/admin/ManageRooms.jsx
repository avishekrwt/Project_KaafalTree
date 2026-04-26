import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { getImageUrl } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import FormModal from '../../components/admin/FormModal';
import ImageUpload from '../../components/admin/ImageUpload';
import './admin.css';

const emptyForm = {
  name: '',
  description: '',
  pricePerNight: '',
  totalUnits: 1,
  capacity: '2 Guests',
  amenities: '',
  imageUrl: '',
  image: null,
  isAvailable: true,
};

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getRooms();
      setRooms(response.data);
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

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditing(room);
    setForm({
      name: room.name,
      description: room.description,
      pricePerNight: room.pricePerNight,
      totalUnits: room.totalUnits,
      capacity: room.capacity,
      amenities: room.amenities.join(', '),
      imageUrl: room.imageUrl || '',
      image: null,
      isAvailable: room.isAvailable,
    });
    setModalOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      amenities: form.amenities.split(',').map((item) => item.trim()).filter(Boolean),
    };
    if (editing) {
      await adminApi.updateRoom(editing.id, payload);
    } else {
      await adminApi.createRoom(payload);
    }
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(false);
    load();
  };

  const remove = async (id) => {
    await adminApi.deleteRoom(id);
    load();
  };

  if (loading) return <LoadingSpinner label="Loading rooms..." />;
  if (error) return <ErrorMessage message={error} actionLabel="Retry" onAction={load} />;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Rooms</h1>
          <p>Manage room inventory, descriptions, pricing, and booking visibility.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>Add Room</button>
      </div>

      <div className="admin-grid admin-grid--two">
        {rooms.map((room) => (
          <article key={room.id} className="admin-card">
            {room.imageUrl ? <img src={getImageUrl(room.imageUrl)} alt={room.name} style={{ borderRadius: '14px', marginBottom: '14px', aspectRatio: '16 / 10', objectFit: 'cover' }} /> : null}
            <h3>{room.name}</h3>
            <p className="admin-muted">{room.capacity} | Rs {room.pricePerNight}/night</p>
            <p>{room.description}</p>
            <p className="admin-muted">{room.amenities.join(', ')}</p>
            <div className="admin-actions">
              <button type="button" className="btn btn-outline" onClick={() => openEdit(room)}>Edit</button>
              <button type="button" className="btn btn-primary" onClick={() => remove(room.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      <FormModal open={modalOpen} title={editing ? 'Edit Room' : 'Create Room'} onClose={() => { setEditing(null); setForm(emptyForm); setModalOpen(false); }}>
        <form onSubmit={submit}>
          <label className="admin-field"><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label className="admin-field"><span>Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
          <div className="admin-grid admin-grid--two">
            <label className="admin-field"><span>Price Per Night</span><input type="number" value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} required /></label>
            <label className="admin-field"><span>Total Units</span><input type="number" value={form.totalUnits} onChange={(e) => setForm({ ...form, totalUnits: e.target.value })} required /></label>
          </div>
          <label className="admin-field"><span>Capacity</span><input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required /></label>
          <label className="admin-field"><span>Amenities (comma separated)</span><input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} /></label>
          <label className="admin-field"><span>Image URL</span><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
          <ImageUpload label="Upload Image" name="image" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
          <label className="admin-inline"><input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} /><span>Available for booking</span></label>
          <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Create Room'}</button>
        </form>
      </FormModal>
    </section>
  );
}
