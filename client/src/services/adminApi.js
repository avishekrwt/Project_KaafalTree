import request, { createFormData } from './api';

export const adminApi = {
  login: (payload) => request('/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/admin/logout', { method: 'POST' }),
  getProfile: () => request('/admin/profile'),
  getStats: () => request('/admin/stats'),

  getBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/bookings${query ? `?${query}` : ''}`);
  },
  updateBooking: (id, payload) => request(`/admin/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteBooking: (id) => request(`/admin/bookings/${id}`, { method: 'DELETE' }),

  getMessages: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/messages${query ? `?${query}` : ''}`);
  },
  updateMessage: (id, payload) => request(`/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),

  getRooms: () => request('/admin/rooms'),
  createRoom: (payload) => request('/admin/rooms', { method: 'POST', body: createFormData(payload) }),
  updateRoom: (id, payload) => request(`/admin/rooms/${id}`, { method: 'PATCH', body: createFormData(payload) }),
  deleteRoom: (id) => request(`/admin/rooms/${id}`, { method: 'DELETE' }),

  getMenuCategories: () => request('/admin/menu/categories'),
  createMenuCategory: (payload) => request('/admin/menu/categories', { method: 'POST', body: JSON.stringify(payload) }),
  updateMenuCategory: (id, payload) => request(`/admin/menu/categories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteMenuCategory: (id) => request(`/admin/menu/categories/${id}`, { method: 'DELETE' }),
  createMenuItem: (payload) => request('/admin/menu/items', { method: 'POST', body: JSON.stringify(payload) }),
  updateMenuItem: (id, payload) => request(`/admin/menu/items/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteMenuItem: (id) => request(`/admin/menu/items/${id}`, { method: 'DELETE' }),

  getGallery: () => request('/admin/gallery'),
  createGalleryImage: (payload) => request('/admin/gallery', { method: 'POST', body: createFormData(payload) }),
  updateGalleryImage: (id, payload) => request(`/admin/gallery/${id}`, { method: 'PATCH', body: createFormData(payload) }),
  deleteGalleryImage: (id) => request(`/admin/gallery/${id}`, { method: 'DELETE' }),

  getTestimonials: () => request('/admin/testimonials'),
  createTestimonial: (payload) => request('/admin/testimonials', { method: 'POST', body: JSON.stringify(payload) }),
  updateTestimonial: (id, payload) => request(`/admin/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteTestimonial: (id) => request(`/admin/testimonials/${id}`, { method: 'DELETE' }),
};

export default adminApi;
