const { body, param, query } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { Booking, Room } = require('../models');
const { sendBookingAdminEmail, sendBookingGuestEmail } = require('../utils/email');
const { createOrder, isPaymentConfigured } = require('../utils/payment');
const { bookingSerializer } = require('../utils/serializers');
const { AppError, createPagination } = require('../utils/api');

const computeNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.ceil((end - start) / 86400000);
};

const buildBookingPayload = async (bodyData) => {
  const room = bodyData.roomId ? await Room.findByPk(bodyData.roomId) : null;
  if (bodyData.roomId && !room) {
    throw new AppError(400, 'Selected room does not exist.');
  }

  const nights = computeNights(bodyData.checkIn, bodyData.checkOut);
  const totalPrice = room ? nights * Number(room.price_per_night) : null;

  return {
    room,
    payload: {
      room_id: bodyData.roomId || null,
      guest_name: bodyData.guestName,
      guest_email: bodyData.guestEmail,
      guest_phone: bodyData.guestPhone,
      checkin_date: bodyData.checkIn,
      checkout_date: bodyData.checkOut,
      num_guests: bodyData.numGuests,
      total_price: totalPrice,
      special_requests: bodyData.specialRequests || null,
      status: bodyData.mode === 'payment' ? 'confirmed' : 'pending',
      booking_mode: bodyData.mode,
    },
  };
};

const createBooking = [
  validate([
    body('guestName').trim().isLength({ min: 2, max: 100 }).withMessage('Guest name must be 2-100 characters long.'),
    body('guestEmail').trim().isEmail().withMessage('Valid email is required.'),
    body('guestPhone').trim().isLength({ min: 7, max: 20 }).withMessage('Valid phone number is required.'),
    body('checkIn').isISO8601().withMessage('Check-in date is required.'),
    body('checkOut').isISO8601().withMessage('Check-out date is required.'),
    body('numGuests').isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20.'),
    body('mode').optional().isIn(['inquiry', 'payment']).withMessage('Mode must be inquiry or payment.'),
    body('roomId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Room must be valid.'),
    body('specialRequests').optional({ nullable: true }).isLength({ max: 2000 }).withMessage('Special requests are too long.'),
    body().custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkIn = new Date(value.checkIn);
      const checkOut = new Date(value.checkOut);
      if (checkIn < today) {
        throw new Error('Check-in date must be today or later.');
      }
      if (checkOut <= checkIn) {
        throw new Error('Check-out date must be after check-in date.');
      }
      return true;
    }),
  ]),
  asyncHandler(async (req, res) => {
    const mode = req.body.mode || 'inquiry';
    const { room, payload } = await buildBookingPayload({ ...req.body, mode });

    const booking = await Booking.create(payload);

    let order = null;
    if (mode === 'payment' && isPaymentConfigured && payload.total_price) {
      order = await createOrder({
        amount: Math.round(payload.total_price * 100),
        receipt: `booking_${booking.id}`,
        notes: { bookingId: String(booking.id) },
      });

      if (order) {
        booking.payment_order_id = order.id;
        await booking.save();
      }
    }

    await Promise.all([
      sendBookingGuestEmail(booking, room),
      sendBookingAdminEmail(booking, room),
    ]);

    const fullBooking = await Booking.findByPk(booking.id, {
      include: [{ model: Room, as: 'room' }],
    });

    res.status(201).json({
      data: bookingSerializer(fullBooking),
      capabilities: {
        paymentsEnabled: isPaymentConfigured,
      },
      payment: order
        ? {
            keyId: process.env.RAZORPAY_KEY_ID,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
          }
        : null,
    });
  }),
];

const listBookingsAdmin = [
  validate([
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['pending', 'confirmed', 'paid', 'cancelled']),
  ]),
  asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    const where = req.query.status ? { status: req.query.status } : {};

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [{ model: Room, as: 'room' }],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    res.json({
      data: rows.map(bookingSerializer),
      meta: createPagination(page, limit, count),
    });
  }),
];

const updateBookingStatus = [
  validate([
    param('id').isInt({ min: 1 }),
    body('status').isIn(['pending', 'confirmed', 'paid', 'cancelled']).withMessage('Invalid status.'),
  ]),
  asyncHandler(async (req, res) => {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Room, as: 'room' }],
    });

    if (!booking) {
      throw new AppError(404, 'Booking not found.');
    }

    booking.status = req.body.status;
    await booking.save();

    res.json({ data: bookingSerializer(booking) });
  }),
];

const deleteBooking = [
  validate([param('id').isInt({ min: 1 })]),
  asyncHandler(async (req, res) => {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      throw new AppError(404, 'Booking not found.');
    }

    await booking.destroy();
    res.json({ data: { success: true } });
  }),
];

module.exports = {
  createBooking,
  deleteBooking,
  listBookingsAdmin,
  updateBookingStatus,
};
