import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h3 className="footer__logo">Kaafal Tree</h3>
            <p className="footer__tagline">Cottage & Restaurant</p>
            <p className="footer__desc">
              A peaceful mountain retreat nestled in the Himalayan forests of Phata,
              on the sacred Kedarnath route. Where nature meets comfort.
            </p>
          </div>

          <div className="footer__col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">Rooms</Link></li>
              <li><Link to="/restaurant">Restaurant</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact Info</h4>
            <ul className="footer__contact">
              <li>
                <MapPin size={16} />
                <span>Phata, Rudraprayag District,<br />Uttarakhand, India<br />On the Kedarnath Route</span>
              </li>
              <li>
                <Phone size={16} />
                <span>+91 8979472292</span>
              </li>
              <li>
                <Mail size={16} />
                <span>info@kaafaltree.com</span>
              </li>
              <li>
                <Clock size={16} />
                <span>Check-in: 12:00 PM<br />Check-out: 11:00 AM</span>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Getting Here</h4>
            <p className="footer__text">
              Located on the Kedarnath Yatra route, Phata is accessible by road from
              Rishikesh (190 km), Haridwar (210 km), and Dehradun (230 km).
              Helicopter services to Kedarnath are available from Phata helipad.
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Kaafal Tree Cottage & Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
