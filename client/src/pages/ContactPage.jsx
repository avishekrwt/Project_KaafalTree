import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, Mountain } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { publicApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './ContactPage.css';

const initialBookingForm = {
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  roomId: '',
  numGuests: 2,
  checkIn: null,
  checkOut: null,
  specialRequests: '',
};

const initialContactForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function ContactPage() {
  const [rooms, setRooms] = useState([]);
  const [capabilities, setCapabilities] = useState({ paymentsEnabled: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [contactForm, setContactForm] = useState(initialContactForm);
  const [bookingErrors, setBookingErrors] = useState([]);
  const [contactErrors, setContactErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState('');
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    Promise.all([publicApi.getRooms(), publicApi.getCapabilities()])
      .then(([roomsResponse, capabilitiesResponse]) => {
        setRooms(roomsResponse.data);
        setCapabilities(capabilitiesResponse.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (bookingForm.checkIn && bookingForm.checkOut) {
      setCheckingAvailability(true);
      setAvailability(null);
      publicApi.checkAvailability(formatDate(bookingForm.checkIn), formatDate(bookingForm.checkOut))
        .then(res => {
          setAvailability(res.data.available);
        })
        .catch(err => {
          console.error('Failed to check availability', err);
        })
        .finally(() => {
          setCheckingAvailability(false);
        });
    } else {
      setAvailability(null);
      setCheckingAvailability(false);
    }
  }, [bookingForm.checkIn, bookingForm.checkOut]);

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRazorpay = async ({ booking, payment }) => {
    if (!window.Razorpay || !payment) {
      throw new Error('Payment gateway is not available in the browser.');
    }

    return new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: payment.keyId,
        order_id: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        name: 'Kaafal Tree Cottage & Restaurant',
        description: `Booking #${booking.id}`,
        prefill: {
          name: booking.guestName,
          email: booking.guestEmail,
          contact: booking.guestPhone,
        },
        handler: async (response) => {
          try {
            await publicApi.verifyPayment({
              bookingId: booking.id,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        },
      });

      razorpay.on('payment.failed', () => {
        reject(new Error('Payment was not completed.'));
      });

      razorpay.open();
    });
  };

  const handleBookingSubmit = async (mode) => {
    setSubmitting(mode);
    setBookingErrors([]);
    setSuccessMessage('');

    if (!validateEmail(bookingForm.guestEmail)) {
      setBookingErrors([{ message: 'Please enter a valid email address.' }]);
      setSubmitting('');
      return;
    }
    if (!validatePhone(bookingForm.guestPhone)) {
      setBookingErrors([{ message: 'Phone number must be exactly 10 digits (numbers only).' }]);
      setSubmitting('');
      return;
    }
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      setBookingErrors([{ message: 'Please select check-in and check-out dates.' }]);
      setSubmitting('');
      return;
    }

    try {
      const response = await publicApi.createBooking({
        ...bookingForm,
        checkIn: formatDate(bookingForm.checkIn),
        checkOut: formatDate(bookingForm.checkOut),
        roomId: bookingForm.roomId || null,
        numGuests: Number(bookingForm.numGuests),
        mode,
      });

      if (mode === 'payment' && response.payment) {
        await handleRazorpay({ booking: response.data, payment: response.payment });
        setSuccessMessage('Booking created and payment verified successfully.');
      } else if (mode === 'payment' && !response.capabilities.paymentsEnabled) {
        setSuccessMessage('Booking inquiry created. Online payment is not configured yet, so our team will contact you.');
      } else {
        setSuccessMessage('Your booking inquiry has been submitted successfully.');
      }

      setBookingForm(initialBookingForm);
    } catch (err) {
      setBookingErrors(err.errors || [{ message: err.message }]);
    } finally {
      setSubmitting('');
    }
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setSubmitting('contact');
    setContactErrors([]);
    setSuccessMessage('');

    if (!validateEmail(contactForm.email)) {
      setContactErrors([{ message: 'Please enter a valid email address.' }]);
      setSubmitting('');
      return;
    }
    if (contactForm.phone && !validatePhone(contactForm.phone)) {
      setContactErrors([{ message: 'Phone number must be exactly 10 digits (numbers only).' }]);
      setSubmitting('');
      return;
    }

    try {
      await publicApi.createContact(contactForm);
      setContactForm(initialContactForm);
      setSuccessMessage('Your message has been sent successfully.');
    } catch (err) {
      setContactErrors(err.errors || [{ message: err.message }]);
    } finally {
      setSubmitting('');
    }
  };

  return (
    <div className="contact-page">
      <section className="page-hero" style={{ backgroundImage: 'url(/images/cottage-exterior-1.jpg)' }}>
        <div className="page-hero-content">
          <span className="section-label">Get In Touch</span>
          <h1>Contact Us</h1>
          <p>Book your stay or ask us anything</p>
        </div>
      </section>

      <section className="contact section-padding">
        <div className="container">
          <div className="contact__grid">
            <div className="contact__info">
              <h2>Get in Touch</h2>
              <p className="contact__info-text">
                Have questions about rooms, availability, or the Kedarnath route? We&apos;re happy to help.
              </p>

              <div className="contact__details">
                <div className="contact__detail"><div className="contact__detail-icon"><MapPin size={20} /></div><div><h4>Location</h4><p>Phata, Rudraprayag District<br />Uttarakhand, India 246471<br />On the Kedarnath Yatra Route</p></div></div>
                <div className="contact__detail"><div className="contact__detail-icon"><Phone size={20} /></div><div><h4>Phone</h4><p>+91 8979472292</p><p className="contact__detail-sub">Available 7 AM - 10 PM</p></div></div>
                <div className="contact__detail"><div className="contact__detail-icon"><Mail size={20} /></div><div><h4>Email</h4><p>info@kaafaltree.com</p></div></div>
                <div className="contact__detail"><div className="contact__detail-icon"><Clock size={20} /></div><div><h4>Timings</h4><p>Check-in: 12:00 PM<br />Check-out: 11:00 AM</p><p className="contact__detail-sub">Restaurant: 7 AM - 10 PM</p></div></div>
              </div>
            </div>

            <div className="contact__form-wrapper">
              <h3>Booking Request</h3>
              {loading ? <LoadingSpinner label="Loading booking details..." /> : null}
              {error ? <ErrorMessage message={error} /> : null}
              {successMessage ? <div className="contact__success"><h4>Success</h4><p>{successMessage}</p></div> : null}
              {bookingErrors.length ? <div className="contact__errors">{bookingErrors.map((item, index) => <p key={index}>{item.message}</p>)}</div> : null}
              <form className="contact__form" onSubmit={(e) => { e.preventDefault(); handleBookingSubmit('inquiry'); }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" value={bookingForm.guestName} onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" placeholder="example@email.com" value={bookingForm.guestEmail} onChange={(e) => setBookingForm({ ...bookingForm, guestEmail: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Phone * <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>(10 digits)</span></label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="9876543210"
                      value={bookingForm.guestPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setBookingForm({ ...bookingForm, guestPhone: val });
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Check-in Date *</label>
                    <DatePicker 
                      selected={bookingForm.checkIn} 
                      onChange={(date) => setBookingForm({ ...bookingForm, checkIn: date })} 
                      selectsStart
                      startDate={bookingForm.checkIn}
                      endDate={bookingForm.checkOut}
                      minDate={new Date()}
                      placeholderText="Select Check-in Date"
                      className="date-picker-input"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-out Date *</label>
                    <DatePicker 
                      selected={bookingForm.checkOut} 
                      onChange={(date) => setBookingForm({ ...bookingForm, checkOut: date })} 
                      selectsEnd
                      startDate={bookingForm.checkIn}
                      endDate={bookingForm.checkOut}
                      minDate={bookingForm.checkIn || new Date()}
                      placeholderText="Select Check-out Date"
                      className="date-picker-input"
                      required 
                    />
                  </div>
                </div>
                {checkingAvailability && <p style={{ color: '#0284c7', marginTop: '-10px', marginBottom: '15px', fontSize: '0.9rem' }}>Checking availability...</p>}
                {availability === true && <p style={{ color: '#16a34a', marginTop: '-10px', marginBottom: '15px', fontSize: '0.9rem', fontWeight: 'bold' }}>✓ Dates are available for booking!</p>}
                {availability === false && <p style={{ color: '#dc2626', marginTop: '-10px', marginBottom: '15px', fontSize: '0.9rem', fontWeight: 'bold' }}>✗ No rooms available for selected dates.</p>}
                <div className="form-row">
                  <div className="form-group">
                    <label>Room</label>
                    <select value={bookingForm.roomId} onChange={(e) => setBookingForm({ ...bookingForm, roomId: e.target.value })}>
                      <option value="">Let the team suggest</option>
                      {rooms.map((room) => <option key={room.id} value={room.id}>{room.name} - Rs {room.pricePerNight}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Guests</label>
                    <select value={bookingForm.numGuests} onChange={(e) => setBookingForm({ ...bookingForm, numGuests: e.target.value })}>
                      {[1, 2, 3, 4, 5, 6].map((num) => <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Special Requests</label>
                  <textarea rows={4} value={bookingForm.specialRequests} onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })} />
                </div>
                <div className="contact__actions">
                  <button type="submit" className="btn btn-primary contact__submit" disabled={submitting !== ''}>
                    {submitting === 'inquiry' ? 'Submitting...' : 'Send Booking Inquiry'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline contact__submit"
                    disabled={!capabilities.paymentsEnabled || submitting !== ''}
                    onClick={() => handleBookingSubmit('payment')}
                  >
                    {submitting === 'payment' ? 'Processing...' : capabilities.paymentsEnabled ? 'Book & Pay Now' : 'Pay Now Unavailable'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="contact__message-card">
            <h3>General Inquiry</h3>
            {contactErrors.length ? <div className="contact__errors">{contactErrors.map((item, index) => <p key={index}>{item.message}</p>)}</div> : null}
            <form className="contact__form" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Name *</label><input type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required /></div>
                <div className="form-group"><label>Email *</label><input type="email" placeholder="example@email.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required /></div>
              </div>
              <div className="form-group">
                <label>Phone <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>(10 digits)</span></label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="9876543210"
                  value={contactForm.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setContactForm({ ...contactForm, phone: val });
                  }}
                />
              </div>
              <div className="form-group"><label>Message *</label><textarea rows={5} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required /></div>
              <button type="submit" className="btn btn-primary" disabled={submitting === 'contact'}>{submitting === 'contact' ? 'Sending...' : 'Send Message'}</button>
            </form>
          </div>
        </div>
      </section>

      <section className="contact-directions section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-label">How to Reach</span>
            <h2>Getting to Kaafal Tree</h2>
          </div>
          <div className="directions__grid">
            <div className="direction-card"><Navigation size={28} /><h3>From Rishikesh</h3><p>190 km via NH-7. Drive through Devprayag, Srinagar, and Rudraprayag. Takes approximately 7-8 hours by road.</p></div>
            <div className="direction-card"><Navigation size={28} /><h3>From Haridwar</h3><p>210 km via Rishikesh-Badrinath Highway. Regular bus services and shared cabs available from Haridwar.</p></div>
            <div className="direction-card"><Mountain size={28} /><h3>Kedarnath Connection</h3><p>Phata is a key stop on the Kedarnath Yatra route. Helicopter services to Kedarnath operate from the nearby Phata helipad.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
