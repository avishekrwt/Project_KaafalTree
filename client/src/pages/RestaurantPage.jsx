import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Leaf, Clock, Star, Phone } from 'lucide-react';
import { publicApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './RestaurantPage.css';

export default function RestaurantPage() {
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    publicApi.getMenu()
      .then((response) => setMenuCategories(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="restaurant-page">
      <section className="page-hero" style={{ backgroundImage: 'url(/images/outdoor-dining.jpg)' }}>
        <div className="page-hero-content">
          <span className="section-label">Dining</span>
          <h1>Our Restaurant</h1>
          <p>Authentic Garhwali cuisine with a taste of the mountains</p>
        </div>
      </section>

      <section className="restaurant-intro section-padding">
        <div className="container">
          <div className="restaurant-intro__grid">
            <div className="restaurant-intro__text">
              <span className="section-label">Taste the Mountains</span>
              <h2>Homemade Food, Mountain Flavor</h2>
              <p>At Kaafal Tree, every meal is a celebration of Uttarakhand's rich culinary heritage.</p>
              <p>Whether you're refueling before your Kedarnath yatra or simply savoring the mountain atmosphere, our food will warm your heart and nourish your soul.</p>
              <div className="restaurant-intro__features">
                <div className="restaurant-intro__feature"><Leaf size={20} /><span>Fresh Local Ingredients</span></div>
                <div className="restaurant-intro__feature"><Utensils size={20} /><span>Traditional Recipes</span></div>
                <div className="restaurant-intro__feature"><Clock size={20} /><span>Serving All Day</span></div>
                <div className="restaurant-intro__feature"><Star size={20} /><span>Vegetarian Friendly</span></div>
              </div>
            </div>
            <div className="restaurant-intro__img">
              <img src="/images/restaurant-interior.jpg" alt="Restaurant interior" />
            </div>
          </div>
        </div>
      </section>

      <section className="restaurant-menu section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Menu</span>
            <h2>What We Serve</h2>
            <p>Fresh, homemade dishes prepared with love every day</p>
          </div>
          {loading ? <LoadingSpinner label="Loading menu..." /> : null}
          {error ? <ErrorMessage message={error} /> : null}
          <div className="menu-grid">
            {menuCategories.map((cat) => (
              <div key={cat.id} className="menu-category">
                <h3>{cat.name}</h3>
                <div className="menu-items">
                  {cat.items.map((item) => (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item__name">{item.name}{item.price ? <span> - Rs {item.price}</span> : null}</div>
                      <div className="menu-item__desc">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="menu-note">
            * Menu items may vary based on season and availability of local ingredients.
            Prices available on request. We cater to vegetarian preferences.
          </p>
        </div>
      </section>

      <section className="restaurant-spaces section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Dining Spaces</span>
            <h2>Where You Can Dine</h2>
          </div>
          <div className="spaces-grid">
            <div className="space-card">
              <div className="space-card__img"><img src="/images/restaurant-interior.jpg" alt="Indoor dining" /></div>
              <div className="space-card__info"><h3>Indoor Restaurant</h3><p>Our spacious indoor dining hall seats 30+ guests comfortably.</p></div>
            </div>
            <div className="space-card">
              <div className="space-card__img"><img src="/images/outdoor-dining.jpg" alt="Outdoor dining" /></div>
              <div className="space-card__info"><h3>Outdoor Dining Area</h3><p>Our magical open-air dining area is adorned with colorful hanging umbrellas and fairy lights.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="restaurant-cta">
        <div className="container">
          <div className="restaurant-cta__inner">
            <h2>Hungry? Come Dine With Us!</h2>
            <p>Our restaurant is open to both staying guests and visitors passing through Phata</p>
            <Link to="/contact" className="btn btn-primary"><Phone size={16} /> Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
