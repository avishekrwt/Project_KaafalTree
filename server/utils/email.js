const sgMail = require('@sendgrid/mail');

const isEmailConfigured = Boolean(
  process.env.SENDGRID_API_KEY &&
  process.env.SENDGRID_FROM_EMAIL &&
  process.env.ADMIN_EMAIL
);

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendMailSafe = async (message, label) => {
  if (!isEmailConfigured) {
    console.warn(`[email] Skipped ${label}: SendGrid is not configured.`);
    return { sent: false, skipped: true };
  }

  try {
    await sgMail.send({
      from: process.env.SENDGRID_FROM_EMAIL,
      ...message,
    });
    return { sent: true, skipped: false };
  } catch (error) {
    console.error(`[email] Failed ${label}:`, error.message);
    return { sent: false, skipped: false, error: error.message };
  }
};

const sendBookingGuestEmail = async (booking, room) => {
  if (!booking.guest_email) {
    return { sent: false, skipped: true };
  }

  return sendMailSafe(
    {
      to: booking.guest_email,
      subject: `Booking ${booking.booking_mode === 'payment' ? 'created' : 'inquiry received'} - Kaafal Tree`,
      html: `
        <h2>Thank you for contacting Kaafal Tree</h2>
        <p>Hi ${booking.guest_name},</p>
        <p>Your booking ${booking.booking_mode === 'payment' ? 'request' : 'inquiry'} has been received.</p>
        <p><strong>Room:</strong> ${room ? room.name : 'To be assigned'}</p>
        <p><strong>Dates:</strong> ${booking.checkin_date} to ${booking.checkout_date}</p>
        <p><strong>Guests:</strong> ${booking.num_guests}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      `,
    },
    'booking guest email'
  );
};

const sendBookingAdminEmail = async (booking, room) =>
  sendMailSafe(
    {
      to: process.env.ADMIN_EMAIL,
      subject: `New booking ${booking.booking_mode === 'payment' ? 'request' : 'inquiry'} from ${booking.guest_name}`,
      html: `
        <h2>New booking received</h2>
        <p><strong>Name:</strong> ${booking.guest_name}</p>
        <p><strong>Email:</strong> ${booking.guest_email}</p>
        <p><strong>Phone:</strong> ${booking.guest_phone}</p>
        <p><strong>Room:</strong> ${room ? room.name : 'Not selected'}</p>
        <p><strong>Dates:</strong> ${booking.checkin_date} to ${booking.checkout_date}</p>
        <p><strong>Guests:</strong> ${booking.num_guests}</p>
        <p><strong>Mode:</strong> ${booking.booking_mode}</p>
        <p><strong>Notes:</strong> ${booking.special_requests || 'None'}</p>
      `,
    },
    'booking admin email'
  );

const sendContactAdminEmail = async (contact) =>
  sendMailSafe(
    {
      to: process.env.ADMIN_EMAIL,
      subject: `New contact message from ${contact.name}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
      `,
    },
    'contact admin email'
  );

module.exports = {
  isEmailConfigured,
  sendBookingGuestEmail,
  sendBookingAdminEmail,
  sendContactAdminEmail,
};
