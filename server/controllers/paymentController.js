const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { Booking, Room } = require('../models');
const { createOrder, isPaymentConfigured, verifySignature } = require('../utils/payment');
const { AppError } = require('../utils/api');
const { bookingSerializer } = require('../utils/serializers');

const createPaymentOrder = [
  validate([
    body('bookingId').isInt({ min: 1 }).withMessage('Booking id is required.'),
  ]),
  asyncHandler(async (req, res) => {
    if (!isPaymentConfigured) {
      return res.status(503).json({ error: 'Payments are not configured for this environment.' });
    }

    const booking = await Booking.findByPk(req.body.bookingId);
    if (!booking) {
      throw new AppError(404, 'Booking not found.');
    }

    if (!booking.total_price) {
      throw new AppError(400, 'Booking total price is required before payment.');
    }

    const order = await createOrder({
      amount: Math.round(Number(booking.total_price) * 100),
      receipt: `booking_${booking.id}`,
      notes: { bookingId: String(booking.id) },
    });

    booking.payment_order_id = order.id;
    booking.booking_mode = 'payment';
    booking.status = 'confirmed';
    await booking.save();

    res.json({
      data: {
        bookingId: booking.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  }),
];

const verifyPayment = [
  validate([
    body('bookingId').isInt({ min: 1 }),
    body('orderId').notEmpty(),
    body('paymentId').notEmpty(),
    body('signature').notEmpty(),
  ]),
  asyncHandler(async (req, res) => {
    if (!isPaymentConfigured) {
      return res.status(503).json({ error: 'Payments are not configured for this environment.' });
    }

    const booking = await Booking.findByPk(req.body.bookingId, {
      include: [{ model: Room, as: 'room' }],
    });

    if (!booking) {
      throw new AppError(404, 'Booking not found.');
    }

    const valid = verifySignature({
      orderId: req.body.orderId,
      paymentId: req.body.paymentId,
      signature: req.body.signature,
    });

    if (!valid) {
      throw new AppError(400, 'Payment verification failed.');
    }

    booking.payment_id = req.body.paymentId;
    booking.payment_order_id = req.body.orderId;
    booking.status = 'paid';
    booking.booking_mode = 'payment';
    await booking.save();

    res.json({ data: bookingSerializer(booking) });
  }),
];

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
