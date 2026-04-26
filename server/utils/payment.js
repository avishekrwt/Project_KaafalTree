const crypto = require('crypto');
const Razorpay = require('razorpay');

const isPaymentConfigured = Boolean(
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes('xxxxxxxx') &&
  !process.env.RAZORPAY_KEY_SECRET.includes('xxxxxxxx')
);

const razorpay = isPaymentConfigured
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const createOrder = async ({ amount, currency = 'INR', receipt, notes }) => {
  if (!isPaymentConfigured || !razorpay) {
    return null;
  }

  return razorpay.orders.create({
    amount,
    currency,
    receipt,
    notes,
  });
};

const verifySignature = ({ orderId, paymentId, signature }) => {
  if (!isPaymentConfigured) {
    return false;
  }

  const digest = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return digest === signature;
};

module.exports = {
  createOrder,
  isPaymentConfigured,
  verifySignature,
};
