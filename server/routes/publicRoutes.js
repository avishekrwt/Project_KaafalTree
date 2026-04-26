const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/capabilities', publicController.getCapabilities);
router.get('/rooms', publicController.getRooms);
router.get('/rooms/:id', publicController.getRoomById);
router.get('/menu', publicController.getMenu);
router.get('/gallery', publicController.getGallery);
router.get('/testimonials', publicController.getTestimonials);

module.exports = router;
