const express = require('express');
const bookingController = require('../controllers/bookingController');
const contactController = require('../controllers/contactController');

const bookingRouter = express.Router();
const contactRouter = express.Router();

bookingRouter.post('/', ...bookingController.createBooking);
contactRouter.post('/', ...contactController.createContact);

module.exports = {
  bookingRouter,
  contactRouter,
};
