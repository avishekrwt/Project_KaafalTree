const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, param } = require('express-validator');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const {
  Admin,
  Booking,
  Contact,
  GalleryImage,
  MenuCategory,
  MenuItem,
  Room,
  Testimonial,
} = require('../models');
const {
  bookingSerializer,
  gallerySerializer,
  menuCategorySerializer,
  normalizeAmenities,
  roomSerializer,
  testimonialSerializer,
} = require('../utils/serializers');
const { AppError } = require('../utils/api');

const signToken = (admin) =>
  jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const authCookieOptions = () => ({
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const adminProfile = (admin) => ({
  id: admin.id,
  username: admin.username,
  email: admin.email,
  role: admin.role,
});

const login = [
  validate([
    body('email').trim().isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password is required.'),
  ]),
  asyncHandler(async (req, res) => {
    const admin = await Admin.scope('withPassword').findOne({
      where: { email: req.body.email },
    });

    if (!admin) {
      throw new AppError(401, 'Invalid credentials.');
    }

    const valid = await bcrypt.compare(req.body.password, admin.password_hash);
    if (!valid) {
      throw new AppError(401, 'Invalid credentials.');
    }

    const token = signToken(admin);
    res.cookie('token', token, authCookieOptions());
    res.json({ data: adminProfile(admin) });
  }),
];

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', authCookieOptions());
  res.json({ data: { success: true } });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({ data: adminProfile(req.admin) });
});

const getStats = asyncHandler(async (req, res) => {
  const [bookings, rooms, messages, testimonials] = await Promise.all([
    Booking.count(),
    Room.count(),
    Contact.count(),
    Testimonial.count({ where: { is_approved: false } }),
  ]);

  const recentBookings = await Booking.findAll({
    include: [{ model: Room, as: 'room' }],
    order: [['created_at', 'DESC']],
    limit: 5,
  });

  res.json({
    data: {
      counts: {
        bookings,
        rooms,
        messages,
        pendingTestimonials: testimonials,
      },
      recentBookings: recentBookings.map(bookingSerializer),
    },
  });
});

const saveImageUrl = (file) => (file ? `/uploads/${file.filename}` : null);

const createRoom = [
  validate([
    body('name').trim().isLength({ min: 2, max: 100 }).escape(),
    body('description').trim().isLength({ min: 10, max: 5000 }).escape(),
    body('pricePerNight').isFloat({ min: 0 }),
    body('totalUnits').isInt({ min: 1, max: 100 }),
    body('capacity').trim().isLength({ min: 2, max: 50 }).escape(),
  ]),
  asyncHandler(async (req, res) => {
    const room = await Room.create({
      name: req.body.name,
      description: req.body.description,
      price_per_night: req.body.pricePerNight,
      total_units: req.body.totalUnits,
      capacity: req.body.capacity,
      amenities: normalizeAmenities(req.body.amenities),
      image_url: saveImageUrl(req.file) || req.body.imageUrl || null,
      is_available: req.body.isAvailable !== 'false' && req.body.isAvailable !== false,
    });

    res.status(201).json({ data: roomSerializer(room) });
  }),
];

const updateRoom = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      throw new AppError(404, 'Room not found.');
    }

    Object.assign(room, {
      name: req.body.name ?? room.name,
      description: req.body.description ?? room.description,
      price_per_night: req.body.pricePerNight ?? room.price_per_night,
      total_units: req.body.totalUnits ?? room.total_units,
      capacity: req.body.capacity ?? room.capacity,
      amenities: req.body.amenities !== undefined ? normalizeAmenities(req.body.amenities) : room.amenities,
      image_url: saveImageUrl(req.file) || req.body.imageUrl || room.image_url,
      is_available: req.body.isAvailable !== undefined
        ? req.body.isAvailable === true || req.body.isAvailable === 'true'
        : room.is_available,
    });

    await room.save();
    res.json({ data: roomSerializer(room) });
  }),
];

const deleteRoom = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      throw new AppError(404, 'Room not found.');
    }
    await room.destroy();
    res.json({ data: { success: true } });
  }),
];

const createMenuCategory = [
  validate([body('name').trim().isLength({ min: 2, max: 100 }), body('displayOrder').optional().isInt({ min: 0 })]),
  asyncHandler(async (req, res) => {
    const category = await MenuCategory.create({
      name: req.body.name,
      display_order: req.body.displayOrder || 0,
    });
    res.status(201).json({ data: menuCategorySerializer({ ...category.toJSON(), items: [] }) });
  }),
];

const updateMenuCategory = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const category = await MenuCategory.findByPk(req.params.id);
    if (!category) {
      throw new AppError(404, 'Category not found.');
    }
    category.name = req.body.name ?? category.name;
    category.display_order = req.body.displayOrder ?? category.display_order;
    await category.save();
    const full = await MenuCategory.findByPk(category.id, { include: [{ model: MenuItem, as: 'items' }] });
    res.json({ data: menuCategorySerializer(full) });
  }),
];

const deleteMenuCategory = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const category = await MenuCategory.findByPk(req.params.id);
    if (!category) {
      throw new AppError(404, 'Category not found.');
    }
    await category.destroy();
    res.json({ data: { success: true } });
  }),
];

const createMenuItem = [
  validate([
    body('categoryId').isInt({ min: 1 }),
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('description').trim().isLength({ min: 2, max: 2000 }),
    body('price').optional({ nullable: true }).isFloat({ min: 0 }),
  ]),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.create({
      category_id: req.body.categoryId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price || null,
      is_vegetarian: req.body.isVegetarian !== false && req.body.isVegetarian !== 'false',
      is_available: req.body.isAvailable !== false && req.body.isAvailable !== 'false',
    });
    
    // Return full category to ensure frontend state is synced
    const category = await MenuCategory.findByPk(item.category_id, {
      include: [{ model: MenuItem, as: 'items' }],
    });
    res.status(201).json({ data: menuCategorySerializer(category) });
  }),
];

const updateMenuItem = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) {
      throw new AppError(404, 'Menu item not found.');
    }
    Object.assign(item, {
      category_id: req.body.categoryId ?? item.category_id,
      name: req.body.name ?? item.name,
      description: req.body.description ?? item.description,
      price: req.body.price ?? item.price,
      is_vegetarian: req.body.isVegetarian !== undefined
        ? req.body.isVegetarian === true || req.body.isVegetarian === 'true'
        : item.is_vegetarian,
      is_available: req.body.isAvailable !== undefined
        ? req.body.isAvailable === true || req.body.isAvailable === 'true'
        : item.is_available,
    });
    await item.save();
    
    // Return full category to ensure frontend state is synced
    const category = await MenuCategory.findByPk(item.category_id, {
      include: [{ model: MenuItem, as: 'items' }],
    });
    res.json({ data: menuCategorySerializer(category) });
  }),
];

const deleteMenuItem = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) {
      throw new AppError(404, 'Menu item not found.');
    }
    await item.destroy();
    res.json({ data: { success: true } });
  }),
];

const createGalleryImage = [
  validate([
    body('altText').trim().isLength({ min: 2, max: 255 }),
    body('category').isIn(['Property', 'Rooms', 'Restaurant', 'Surroundings']),
    body('displayOrder').optional().isInt({ min: 0 }),
  ]),
  asyncHandler(async (req, res) => {
    const imageUrl = saveImageUrl(req.file) || req.body.imageUrl;
    if (!imageUrl) {
      throw new AppError(400, 'Image file or image URL is required.');
    }

    const image = await GalleryImage.create({
      image_url: imageUrl,
      alt_text: req.body.altText,
      category: req.body.category,
      display_order: req.body.displayOrder || 0,
    });

    res.status(201).json({ data: gallerySerializer(image) });
  }),
];

const updateGalleryImage = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) {
      throw new AppError(404, 'Gallery image not found.');
    }

    const previousPath = image.image_url;
    image.image_url = saveImageUrl(req.file) || req.body.imageUrl || image.image_url;
    image.alt_text = req.body.altText ?? image.alt_text;
    image.category = req.body.category ?? image.category;
    image.display_order = req.body.displayOrder ?? image.display_order;
    await image.save();

    if (req.file && previousPath && previousPath.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', previousPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ data: gallerySerializer(image) });
  }),
];

const deleteGalleryImage = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) {
      throw new AppError(404, 'Gallery image not found.');
    }

    const filePath = image.image_url && image.image_url.startsWith('/uploads/')
      ? path.join(__dirname, '..', image.image_url)
      : null;

    await image.destroy();

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ data: { success: true } });
  }),
];

const listTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.findAll({
    order: [['created_at', 'DESC']],
  });

  res.json({ data: testimonials.map(testimonialSerializer) });
});

const createTestimonial = [
  validate([
    body('guestName').trim().isLength({ min: 2, max: 100 }),
    body('reviewText').trim().isLength({ min: 10, max: 5000 }),
    body('rating').isInt({ min: 1, max: 5 }),
  ]),
  asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.create({
      guest_name: req.body.guestName,
      review_text: req.body.reviewText,
      rating: req.body.rating,
      is_approved: req.body.isApproved === true || req.body.isApproved === 'true',
    });
    res.status(201).json({ data: testimonialSerializer(testimonial) });
  }),
];

const updateTestimonial = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      throw new AppError(404, 'Testimonial not found.');
    }
    testimonial.guest_name = req.body.guestName ?? testimonial.guest_name;
    testimonial.review_text = req.body.reviewText ?? testimonial.review_text;
    testimonial.rating = req.body.rating ?? testimonial.rating;
    if (req.body.isApproved !== undefined) {
      testimonial.is_approved = req.body.isApproved === true || req.body.isApproved === 'true';
    }
    await testimonial.save();
    res.json({ data: testimonialSerializer(testimonial) });
  }),
];

const deleteTestimonial = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      throw new AppError(404, 'Testimonial not found.');
    }
    await testimonial.destroy();
    res.json({ data: { success: true } });
  }),
];

const listRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.findAll({ order: [['id', 'ASC']] });
  res.json({ data: rooms.map(roomSerializer) });
});

const listMenuCategories = asyncHandler(async (req, res) => {
  const categories = await MenuCategory.findAll({
    include: [{ model: MenuItem, as: 'items' }],
    order: [['display_order', 'ASC'], [{ model: MenuItem, as: 'items' }, 'id', 'ASC']],
  });
  res.json({ data: categories.map(menuCategorySerializer) });
});

const listGallery = asyncHandler(async (req, res) => {
  const gallery = await GalleryImage.findAll({ order: [['display_order', 'ASC']] });
  res.json({ data: gallery.map(gallerySerializer) });
});

module.exports = {
  createGalleryImage,
  createMenuCategory,
  createMenuItem,
  createRoom,
  createTestimonial,
  deleteGalleryImage,
  deleteMenuCategory,
  deleteMenuItem,
  deleteRoom,
  deleteTestimonial,
  getProfile,
  getStats,
  listGallery,
  listMenuCategories,
  listRooms,
  listTestimonials,
  login,
  logout,
  updateGalleryImage,
  updateMenuCategory,
  updateMenuItem,
  updateRoom,
  updateTestimonial,
};
