const asyncHandler = require('../utils/asyncHandler');
const { GalleryImage, MenuCategory, MenuItem, Room, Testimonial } = require('../models');
const {
  gallerySerializer,
  menuCategorySerializer,
  roomSerializer,
  testimonialSerializer,
} = require('../utils/serializers');

const getRooms = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.available === 'true') {
    where.is_available = true;
  }

  const rooms = await Room.findAll({
    where,
    order: [['price_per_night', 'ASC'], ['id', 'ASC']],
  });

  res.json({ data: rooms.map(roomSerializer) });
});

const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json({ data: roomSerializer(room) });
});

const getMenu = asyncHandler(async (req, res) => {
  const categories = await MenuCategory.findAll({
    order: [['display_order', 'ASC'], ['id', 'ASC']],
    include: [{
      model: MenuItem,
      as: 'items',
      required: false,
      where: req.query.includeUnavailable === 'true' ? undefined : { is_available: true },
    }],
  });

  res.json({ data: categories.map(menuCategorySerializer) });
});

const getGallery = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.category && req.query.category !== 'All') {
    where.category = req.query.category;
  }

  const images = await GalleryImage.findAll({
    where,
    order: [['display_order', 'ASC'], ['id', 'ASC']],
  });

  res.json({ data: images.map(gallerySerializer) });
});

const getTestimonials = asyncHandler(async (req, res) => {
  const where = req.query.includeUnapproved === 'true'
    ? {}
    : { is_approved: true };

  const testimonials = await Testimonial.findAll({
    where,
    order: [['created_at', 'DESC'], ['id', 'DESC']],
  });

  res.json({ data: testimonials.map(testimonialSerializer) });
});

const getCapabilities = asyncHandler(async (req, res) => {
  res.json({
    data: {
      paymentsEnabled: Boolean(
        process.env.RAZORPAY_KEY_ID &&
        process.env.RAZORPAY_KEY_SECRET &&
        !process.env.RAZORPAY_KEY_ID.includes('xxxxxxxx')
      ),
      emailEnabled: Boolean(
        process.env.SENDGRID_API_KEY &&
        process.env.SENDGRID_FROM_EMAIL &&
        process.env.ADMIN_EMAIL
      ),
    },
  });
});

module.exports = {
  getCapabilities,
  getGallery,
  getMenu,
  getRoomById,
  getRooms,
  getTestimonials,
};
