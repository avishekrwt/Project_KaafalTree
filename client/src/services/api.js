const parseResponse = async (response) => {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = new Error(payload.error || 'Request failed');
    error.status = response.status;
    error.details = payload.details;
    error.errors = payload.errors;
    throw error;
  }

  return payload;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const request = async (path, options = {}) => {
  const url = path.startsWith('/api') 
    ? `${API_BASE_URL}${path}` 
    : `${API_BASE_URL}/api${path}`;

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: options.body instanceof FormData
      ? options.headers
      : {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
  });

  return parseResponse(response);
};

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    return `${baseUrl}${url}`;
  }
  return url;
};

export const publicApi = {
  getCapabilities: () => request('/capabilities'),
  getRooms: () => request('/rooms'),
  getRoom: (id) => request(`/rooms/${id}`),
  getMenu: () => request('/menu'),
  getGallery: (category) => request(`/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getTestimonials: () => request('/testimonials'),
  createBooking: (payload) => request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  createContact: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  createPaymentOrder: (payload) => request('/payment/create-order', { method: 'POST', body: JSON.stringify(payload) }),
  verifyPayment: (payload) => request('/payment/verify', { method: 'POST', body: JSON.stringify(payload) }),
};

export const createFormData = (values) => {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });
  return formData;
};

export default request;
