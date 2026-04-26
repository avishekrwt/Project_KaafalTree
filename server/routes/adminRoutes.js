const express = require('express');
const adminController = require('../controllers/adminController');
const bookingController = require('../controllers/bookingController');
const contactController = require('../controllers/contactController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/login', ...adminController.login);
router.post('/logout', auth, adminAuth, adminController.logout);
router.get('/profile', auth, adminAuth, adminController.getProfile);

router.use(auth, adminAuth);

router.get('/stats', adminController.getStats);

router.get('/bookings', ...bookingController.listBookingsAdmin);
router.patch('/bookings/:id', ...bookingController.updateBookingStatus);
router.delete('/bookings/:id', ...bookingController.deleteBooking);

router.get('/messages', ...contactController.listContactsAdmin);
router.patch('/messages/:id', ...contactController.updateContact);
router.delete('/messages/:id', ...contactController.deleteContact);

router.get('/rooms', adminController.listRooms);
router.post('/rooms', upload.single('image'), ...adminController.createRoom);
router.patch('/rooms/:id', upload.single('image'), ...adminController.updateRoom);
router.delete('/rooms/:id', ...adminController.deleteRoom);

router.get('/menu/categories', adminController.listMenuCategories);
router.post('/menu/categories', ...adminController.createMenuCategory);
router.patch('/menu/categories/:id', ...adminController.updateMenuCategory);
router.delete('/menu/categories/:id', ...adminController.deleteMenuCategory);

router.post('/menu/items', ...adminController.createMenuItem);
router.patch('/menu/items/:id', ...adminController.updateMenuItem);
router.delete('/menu/items/:id', ...adminController.deleteMenuItem);

router.get('/gallery', adminController.listGallery);
router.post('/gallery', upload.single('image'), ...adminController.createGalleryImage);
router.patch('/gallery/:id', upload.single('image'), ...adminController.updateGalleryImage);
router.delete('/gallery/:id', ...adminController.deleteGalleryImage);

router.get('/testimonials', adminController.listTestimonials);
router.post('/testimonials', ...adminController.createTestimonial);
router.patch('/testimonials/:id', ...adminController.updateTestimonial);
router.delete('/testimonials/:id', ...adminController.deleteTestimonial);

module.exports = router;
