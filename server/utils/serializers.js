const normalizeAmenities = (amenities) => {
  if (Array.isArray(amenities)) {
    return amenities;
  }

  if (typeof amenities === 'string') {
    try {
      const parsed = JSON.parse(amenities);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return amenities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const roomSerializer = (room) => ({
  id: room.id,
  name: room.name,
  description: room.description,
  pricePerNight: Number(room.price_per_night || 0),
  totalUnits: room.total_units,
  capacity: room.capacity,
  amenities: normalizeAmenities(room.amenities),
  imageUrl: room.image_url,
  isAvailable: room.is_available,
  createdAt: room.created_at,
  updatedAt: room.updated_at,
});

const bookingSerializer = (booking) => ({
  id: booking.id,
  roomId: booking.room_id,
  guestName: booking.guest_name,
  guestEmail: booking.guest_email,
  guestPhone: booking.guest_phone,
  checkIn: booking.checkin_date,
  checkOut: booking.checkout_date,
  numGuests: booking.num_guests,
  totalPrice: booking.total_price === null ? null : Number(booking.total_price),
  status: booking.status,
  paymentId: booking.payment_id,
  paymentOrderId: booking.payment_order_id,
  bookingMode: booking.booking_mode,
  specialRequests: booking.special_requests,
  createdAt: booking.created_at,
  updatedAt: booking.updated_at,
  room: booking.room ? roomSerializer(booking.room) : null,
});

const contactSerializer = (contact) => ({
  id: contact.id,
  name: contact.name,
  email: contact.email,
  phone: contact.phone,
  message: contact.message,
  status: contact.status,
  createdAt: contact.created_at,
});

const menuCategorySerializer = (category) => ({
  id: category.id,
  name: category.name,
  displayOrder: category.display_order,
  items: (category.items || []).map((item) => ({
    id: item.id,
    categoryId: item.category_id,
    name: item.name,
    description: item.description,
    price: item.price === null ? null : Number(item.price),
    isVegetarian: item.is_vegetarian,
    isAvailable: item.is_available,
  })),
});

const gallerySerializer = (image) => ({
  id: image.id,
  imageUrl: image.image_url,
  altText: image.alt_text,
  category: image.category,
  displayOrder: image.display_order,
  createdAt: image.created_at,
});

const testimonialSerializer = (testimonial) => ({
  id: testimonial.id,
  guestName: testimonial.guest_name,
  reviewText: testimonial.review_text,
  rating: testimonial.rating,
  isApproved: testimonial.is_approved,
  createdAt: testimonial.created_at,
});

module.exports = {
  bookingSerializer,
  contactSerializer,
  gallerySerializer,
  menuCategorySerializer,
  normalizeAmenities,
  roomSerializer,
  testimonialSerializer,
};
