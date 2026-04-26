import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain, Utensils, Car, Wifi, ShowerHead, TreePine,
  Star, ArrowRight, MapPin, Phone, ChevronRight
} from 'lucide-react';
import { publicApi, getImageUrl } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './HomePage.css';

const features = [
  { icon: <Mountain size={28} />, title: 'Mountain Views', desc: 'Wake up to snow-capped Himalayan peaks' },
  { icon: <Utensils size={28} />, title: 'Homemade Food', desc: 'Fresh Garhwali cuisine & local flavors' },
  { icon: <TreePine size={28} />, title: 'Forest Setting', desc: 'Surrounded by dense Himalayan forest' },
  { icon: <Car size={28} />, title: 'Free Parking', desc: 'Spacious parking for cars & buses' },
  { icon: <ShowerHead size={28} />, title: 'Hot Water', desc: '24/7 geyser-heated water in every room' },
  { icon: <Wifi size={28} />, title: 'Kedarnath Base', desc: 'Perfect halt before the holy yatra' },
];

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([publicApi.getRooms(), publicApi.getTestimonials()])
      .then(([roomsResponse, testimonialsResponse]) => {
        setRooms(roomsResponse.data.slice(0, 3));
        setTestimonials(testimonialsResponse.data.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__bg">
          <img src="/images/mountain-view.jpg" alt="Mountain view from Kaafal Tree" />
        </div>
        <div className="hero__overlay" />
        <div className="hero__content">
          <span className="hero__label">Phata, Kedarnath Route</span>
          <h1 className="hero__title">
            Where the Forest<br />
            Meets the Mountains
          </h1>
          <p className="hero__subtitle">
            A peaceful mountain cottage and restaurant nestled in the Himalayan forests.
            Your perfect rest stop on the sacred Kedarnath journey.
          </p>
          <div className="hero__actions">
            <Link to="/rooms" className="btn btn-primary">
              Explore Rooms <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn btn-outline">
              <Phone size={18} /> Contact Us
            </Link>
          </div>
          <div className="hero__badges">
            <div className="hero__badge">
              <MapPin size={14} />
              <span>Phata, Uttarakhand</span>
            </div>
            <div className="hero__badge">
              <Mountain size={14} />
              <span>Kedarnath Route</span>
            </div>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll to explore</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      <section className="features section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2>Everything You Need for a Mountain Retreat</h2>
          </div>
          <div className="features__grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-about section-padding">
        <div className="container">
          <div className="home-about__grid">
            <div className="home-about__images">
              <img src="/images/aerial-view.jpg" alt="Aerial view of Kaafal Tree Cottage" className="home-about__img-main" />
              <img src="/images/outdoor-pergola-1.jpg" alt="Outdoor seating area" className="home-about__img-small" />
            </div>
            <div className="home-about__text">
              <span className="section-label">Our Story</span>
              <h2>The Story of Kaafal Tree</h2>
              <p>
                Hidden beside dense Himalayan forest, our cottage stands under the shade
                of the native <strong>Kafal</strong> fruit tree -- the beloved wild berry of Uttarakhand
                that colors the hillsides every spring.
              </p>
              <p>
                The air carries pine fragrance. The mornings open with mist. The nights
                echo with forest silence. Designed for pilgrims, trekkers, and mountain
                lovers seeking calm comfort before the sacred Kedarnath journey.
              </p>
              <p>
                Our family-run property offers clean, comfortable rooms with attached
                bathrooms and hot water, paired with fresh homemade Garhwali cuisine
                that warms you from the inside.
              </p>
              <Link to="/about" className="btn btn-primary">
                Read Our Full Story <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-rooms section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Accommodation</span>
            <h2>Comfortable Mountain Rooms</h2>
            <p>Clean, cozy rooms with attached bathrooms, hot water, and mountain atmosphere</p>
          </div>
          {loading ? <LoadingSpinner label="Loading room highlights..." /> : null}
          {error ? <ErrorMessage message={error} /> : null}
          <div className="home-rooms__grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-card__img">
                  <img src={getImageUrl(room.imageUrl)} alt={room.name} />
                  <div className="room-card__price">Rs {room.pricePerNight}</div>
                </div>
                <div className="room-card__info">
                  <h3>{room.name}</h3>
                  <p>{room.description}</p>
                  <Link to="/rooms" className="room-card__link">
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="home-rooms__cta">
            <Link to="/rooms" className="btn btn-outline">
              View All Rooms <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-restaurant">
        <div className="home-restaurant__bg">
          <img src="/images/outdoor-dining.jpg" alt="Outdoor dining at Kaafal Tree" />
        </div>
        <div className="home-restaurant__overlay" />
        <div className="home-restaurant__content">
          <span className="section-label">Our Restaurant</span>
          <h2>Taste the Mountains</h2>
          <p>
            Enjoy fresh, homemade Garhwali cuisine in our cozy indoor restaurant or our
            magical outdoor dining area adorned with colorful umbrellas and fairy lights.
          </p>
          <div className="home-restaurant__highlights">
            <div className="home-restaurant__highlight"><Utensils size={20} /><span>Garhwali Cuisine</span></div>
            <div className="home-restaurant__highlight"><Star size={20} /><span>Fresh & Homemade</span></div>
            <div className="home-restaurant__highlight"><TreePine size={20} /><span>Open-Air Dining</span></div>
          </div>
          <Link to="/restaurant" className="btn btn-gold">
            Explore Our Menu <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="home-gallery section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Gallery</span>
            <h2>Glimpses of Kaafal Tree</h2>
          </div>
          <div className="home-gallery__grid">
            <div className="home-gallery__item home-gallery__item--large"><img src="/images/mountain-view.jpg" alt="Mountain view" /></div>
            <div className="home-gallery__item"><img src="/images/cottage-veranda.jpg" alt="Cottage veranda" /></div>
            <div className="home-gallery__item"><img src="/images/outdoor-dining.jpg" alt="Outdoor dining" /></div>
            <div className="home-gallery__item"><img src="/images/room-mountain-view.jpg" alt="Room with view" /></div>
            <div className="home-gallery__item"><img src="/images/property-entrance.jpg" alt="Property entrance" /></div>
          </div>
          <div className="home-gallery__cta">
            <Link to="/gallery" className="btn btn-outline">
              View Full Gallery <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-testimonials section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Guest Reviews</span>
            <h2>What Our Guests Say</h2>
          </div>
          {loading ? <LoadingSpinner label="Loading guest reviews..." /> : null}
          {error ? <ErrorMessage message={error} /> : null}
          <div className="testimonials__grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="#c9a96e" color="#c9a96e" />
                  ))}
                </div>
                <p>&ldquo;{t.reviewText}&rdquo;</p>
                <h4>{t.guestName}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta__bg">
          <img src="/images/cottage-exterior-1.jpg" alt="Kaafal Tree Cottage" />
        </div>
        <div className="home-cta__overlay" />
        <div className="home-cta__content">
          <h2>Ready for Your Mountain Escape?</h2>
          <p>
            Book your stay at Kaafal Tree Cottage and experience the serenity
            of Phata on the sacred Kedarnath route.
          </p>
          <div className="home-cta__actions">
            <Link to="/contact" className="btn btn-primary">
              Book Your Stay <ArrowRight size={18} />
            </Link>
            <a href="tel:+91XXXXXXXXXX" className="btn btn-outline">
              <Phone size={18} /> Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
