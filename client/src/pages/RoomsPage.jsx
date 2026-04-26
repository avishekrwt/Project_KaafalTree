import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, ShowerHead, Mountain, Wind, Users, Check, Phone } from 'lucide-react';
import { publicApi, getImageUrl } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './RoomsPage.css';

const commonAmenities = [
  { icon: <ShowerHead size={20} />, label: 'Hot Water 24/7' },
  { icon: <Mountain size={20} />, label: 'Mountain Surroundings' },
  { icon: <Wind size={20} />, label: 'Fresh Mountain Air' },
  { icon: <Bed size={20} />, label: 'Clean Bedding' },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    publicApi.getRooms()
      .then((response) => setRooms(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rooms-page">
      <section className="page-hero" style={{ backgroundImage: 'url(/images/cottage-veranda.jpg)' }}>
        <div className="page-hero-content">
          <span className="section-label">Accommodation</span>
          <h1>Our Rooms</h1>
          <p>Clean, comfortable stays in the heart of the Himalayas</p>
        </div>
      </section>

      <section className="rooms-amenities">
        <div className="container">
          <div className="rooms-amenities__grid">
            {commonAmenities.map((a, i) => (
              <div key={i} className="rooms-amenity">
                {a.icon}
                <span>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rooms-list section-padding">
        <div className="container">
          {loading ? <LoadingSpinner label="Loading rooms..." /> : null}
          {error ? <ErrorMessage message={error} /> : null}
          {rooms.map((room, i) => (
            <div key={room.id} className={`room-detail ${i % 2 !== 0 ? 'room-detail--reverse' : ''}`}>
              <div className="room-detail__img">
                <img src={getImageUrl(room.imageUrl)} alt={room.name} />
              </div>
              <div className="room-detail__info">
                <h2>{room.name}</h2>
                <div className="room-detail__capacity">
                  <Users size={16} />
                  <span>{room.capacity}</span>
                </div>
                <p>{room.description}</p>
                <div className="room-detail__amenities">
                  {room.amenities.map((a, j) => (
                    <div key={j} className="room-detail__amenity">
                      <Check size={14} />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="btn btn-primary">
                  <Phone size={16} /> Book This Room
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rooms-property section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Property</span>
            <h2>The Cottage Complex</h2>
            <p>Nestled in the forest with mountain views all around</p>
          </div>
          <div className="rooms-property__grid">
            <div className="rooms-property__item rooms-property__item--wide"><img src="/images/aerial-view.jpg" alt="Aerial view of property" /></div>
            <div className="rooms-property__item"><img src="/images/cottage-front.jpg" alt="Cottage front" /></div>
            <div className="rooms-property__item"><img src="/images/cottage-veranda-2.jpg" alt="Cottage veranda" /></div>
          </div>
        </div>
      </section>

      <section className="rooms-cta">
        <div className="container">
          <div className="rooms-cta__inner">
            <h2>Ready to Book Your Stay?</h2>
            <p>Contact us directly for the best rates and availability</p>
            <div className="rooms-cta__actions">
              <Link to="/contact" className="btn btn-primary"><Phone size={16} /> Contact Us to Book</Link>
              <a href="tel:+91XXXXXXXXXX" className="btn btn-outline">Call Directly</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
