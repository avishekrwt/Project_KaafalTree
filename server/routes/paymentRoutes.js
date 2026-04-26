const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-order', ...paymentController.createPaymentOrder);
router.post('/verify', ...paymentController.verifyPayment);

module.exports = router;
