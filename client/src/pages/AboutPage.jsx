import { Link } from 'react-router-dom';
import { TreePine, Heart, Mountain, Users, MapPin, ArrowRight } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section
        className="page-hero"
        style={{ backgroundImage: 'url(/images/signboard.jpg)' }}
      >
        <div className="page-hero-content">
          <span className="section-label">Our Story</span>
          <h1>About Kaafal Tree</h1>
          <p>A family-run mountain retreat in the heart of Uttarakhand</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story section-padding">
        <div className="container">
          <div className="about-story__grid">
            <div className="about-story__text">
              <span className="section-label">The Beginning</span>
              <h2>Named After the Mountains</h2>
              <p>
                The <strong>Kafal</strong> (Myrica esculenta) is a beloved wild fruit of Uttarakhand --
                its sweet-tangy berries color the mountain slopes every spring, and its tree
                stands as a symbol of the region's natural abundance.
              </p>
              <p>
                Our cottage was built under the shade of these very Kafal trees, surrounded by
                dense Himalayan forest. What started as a modest family home gradually grew
                into a welcoming retreat for travelers on the sacred Kedarnath route.
              </p>
              <p>
                Today, Kaafal Tree Cottage & Restaurant offers comfortable accommodation and
                authentic Garhwali cuisine to pilgrims, trekkers, and nature lovers. We take
                pride in providing warm hospitality that feels like home, even at 5,000 feet
                in the mountains.
              </p>
            </div>
            <div className="about-story__images">
              <img
                src="/images/outdoor-pergola-1.jpg"
                alt="The outdoor area of Kaafal Tree"
                className="about-story__img-1"
              />
              <img
                src="/images/outdoor-pergola-2.jpg"
                alt="Guests at Kaafal Tree"
                className="about-story__img-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-label">What We Stand For</span>
            <h2>Our Values</h2>
          </div>
          <div className="about-values__grid">
            <div className="value-card">
              <Heart size={32} />
              <h3>Warm Hospitality</h3>
              <p>
                Every guest is family. We believe in providing genuine care and
                personal attention that makes your mountain stay memorable.
              </p>
            </div>
            <div className="value-card">
              <TreePine size={32} />
              <h3>Nature First</h3>
              <p>
                Built in harmony with the surrounding forest, we respect and preserve
                the natural beauty that makes this place special.
              </p>
            </div>
            <div className="value-card">
              <Mountain size={32} />
              <h3>Local Roots</h3>
              <p>
                From our food to our staff, we celebrate Garhwali culture and support
                the local community of Phata.
              </p>
            </div>
            <div className="value-card">
              <Users size={32} />
              <h3>Pilgrim Friendly</h3>
              <p>
                We understand the needs of Kedarnath yatris and provide services
                tailored for a comfortable pilgrimage journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="about-location section-padding">
        <div className="container">
          <div className="about-location__grid">
            <div className="about-location__img">
              <img src="/images/property-entrance.jpg" alt="Kaafal Tree property" />
            </div>
            <div className="about-location__text">
              <span className="section-label">Location</span>
              <h2>Phata, Kedarnath Route</h2>
              <p>
                Phata is a small village in Rudraprayag district, Uttarakhand, situated on the
                main road leading to the holy shrine of Kedarnath. It serves as an important
                stop for pilgrims and has a helipad for helicopter services to Kedarnath.
              </p>
              <div className="about-location__facts">
                <div className="about-location__fact">
                  <MapPin size={18} />
                  <div>
                    <strong>Altitude</strong>
                    <span>~1,524 m (5,000 ft)</span>
                  </div>
                </div>
                <div className="about-location__fact">
                  <MapPin size={18} />
                  <div>
                    <strong>From Rishikesh</strong>
                    <span>~190 km (7-8 hrs drive)</span>
                  </div>
                </div>
                <div className="about-location__fact">
                  <MapPin size={18} />
                  <div>
                    <strong>To Kedarnath</strong>
                    <span>~30 km + 16 km trek</span>
                  </div>
                </div>
                <div className="about-location__fact">
                  <MapPin size={18} />
                  <div>
                    <strong>Helipad</strong>
                    <span>Phata Helipad nearby</span>
                  </div>
                </div>
              </div>
              <Link to="/contact" className="btn btn-primary">
                Plan Your Visit <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Property Gallery */}
      <section className="about-gallery section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Property</span>
            <h2>See For Yourself</h2>
          </div>
          <div className="about-gallery__grid">
            <div className="about-gallery__item">
              <img src="/images/aerial-view.jpg" alt="Aerial view" />
            </div>
            <div className="about-gallery__item">
              <img src="/images/cottage-veranda.jpg" alt="Veranda" />
            </div>
            <div className="about-gallery__item">
              <img src="/images/mountain-view.jpg" alt="Mountain view" />
            </div>
            <div className="about-gallery__item">
              <img src="/images/outdoor-dining.jpg" alt="Outdoor dining" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta__inner">
            <h2>Come Experience Kaafal Tree</h2>
            <p>We look forward to welcoming you to our mountain home</p>
            <div className="about-cta__actions">
              <Link to="/rooms" className="btn btn-primary">
                View Our Rooms <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
