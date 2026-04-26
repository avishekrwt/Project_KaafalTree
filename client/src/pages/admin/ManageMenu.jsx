import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import './admin.css';

export default function ManageMenu() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryForm, setCategoryForm] = useState({ name: '', displayOrder: 0 });
  const [itemForm, setItemForm] = useState({ categoryId: '', name: '', description: '', price: '', isVegetarian: true, isAvailable: true });

  const load = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getMenuCategories();
      setCategories(response.data);
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

  const createCategory = async (event) => {
    event.preventDefault();
    await adminApi.createMenuCategory(categoryForm);
    setCategoryForm({ name: '', displayOrder: 0 });
    load();
  };

  const createItem = async (event) => {
    event.preventDefault();
    await adminApi.createMenuItem(itemForm);
    setItemForm({ categoryId: '', name: '', description: '', price: '', isVegetarian: true, isAvailable: true });
    load();
  };

  if (loading) return <LoadingSpinner label="Loading menu..." />;
  if (error) return <ErrorMessage message={error} actionLabel="Retry" onAction={load} />;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Menu</h1>
          <p>Organize menu categories and food items for the restaurant page.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid--two">
        <form className="admin-card" onSubmit={createCategory}>
          <h3>Create Category</h3>
          <label className="admin-field"><span>Name</span><input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required /></label>
          <label className="admin-field"><span>Display Order</span><input type="number" value={categoryForm.displayOrder} onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: e.target.value })} /></label>
          <button type="submit" className="btn btn-primary">Add Category</button>
        </form>

        <form className="admin-card" onSubmit={createItem}>
          <h3>Create Item</h3>
          <label className="admin-field"><span>Category</span><select value={itemForm.categoryId} onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })} required><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label className="admin-field"><span>Name</span><input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} required /></label>
          <label className="admin-field"><span>Description</span><textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} required /></label>
          <label className="admin-field"><span>Price</span><input type="number" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} /></label>
          <button type="submit" className="btn btn-primary">Add Item</button>
        </form>
      </div>

      <div className="admin-grid">
        {categories.map((category) => (
          <article key={category.id} className="admin-card">
            <div className="admin-page__header">
              <div>
                <h3>{category.name}</h3>
                <p className="admin-muted">Display order: {category.displayOrder}</p>
              </div>
              <div className="admin-actions">
                <button type="button" className="btn btn-outline" onClick={() => {
                  const name = window.prompt('Category name', category.name);
                  if (name) {
                    adminApi.updateMenuCategory(category.id, { name, displayOrder: category.displayOrder }).then(load);
                  }
                }}>Rename</button>
                <button type="button" className="btn btn-primary" onClick={() => adminApi.deleteMenuCategory(category.id).then(load)}>Delete</button>
              </div>
            </div>
            <div className="admin-grid">
              {category.items.map((item) => (
                <div key={item.id} className="admin-inline" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <strong>{item.name}</strong>
                    <p className="admin-muted">{item.description}</p>
                  </div>
                  <div className="admin-actions">
                    <button type="button" className="btn btn-outline" onClick={() => adminApi.updateMenuItem(item.id, { isAvailable: !item.isAvailable }).then(load)}>
                      {item.isAvailable ? 'Hide' : 'Show'}
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => adminApi.deleteMenuItem(item.id).then(load)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
