import { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi, getImageUrl } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './GalleryPage.css';

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  useEffect(() => {
    publicApi.getGallery()
      .then((response) => setGalleryImages(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ['All', ...new Set(galleryImages.map((image) => image.category))], [galleryImages]);
  const filtered = activeFilter === 'All' ? galleryImages : galleryImages.filter((img) => img.category === activeFilter);

  const openLightbox = (index) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const nextImage = () => setLightbox((prev) => ({ ...prev, index: (prev.index + 1) % filtered.length }));
  const prevImage = () => setLightbox((prev) => ({ ...prev, index: (prev.index - 1 + filtered.length) % filtered.length }));

  return (
    <div className="gallery-page">
      <section className="page-hero" style={{ backgroundImage: 'url(/images/mountain-view.jpg)' }}>
        <div className="page-hero-content">
          <span className="section-label">Photo Gallery</span>
          <h1>Explore Kaafal Tree</h1>
          <p>See our property, rooms, restaurant, and mountain surroundings</p>
        </div>
      </section>

      <section className="gallery section-padding">
        <div className="container">
          <div className="gallery__filters">
            {categories.map((cat) => (
              <button key={cat} className={`gallery__filter ${activeFilter === cat ? 'gallery__filter--active' : ''}`} onClick={() => setActiveFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>
          {loading ? <LoadingSpinner label="Loading gallery..." /> : null}
          {error ? <ErrorMessage message={error} /> : null}
          <div className="gallery__grid">
            {filtered.map((img, i) => (
              <div key={img.id} className="gallery__item" onClick={() => openLightbox(i)}>
                <img src={getImageUrl(img.imageUrl)} alt={img.altText} loading="lazy" />
                <div className="gallery__item-overlay"><span className="gallery__item-cat">{img.category}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox.open && filtered[lightbox.index] ? (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox__close" onClick={closeLightbox}><X size={28} /></button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}><ChevronLeft size={32} /></button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img src={getImageUrl(filtered[lightbox.index].imageUrl)} alt={filtered[lightbox.index].altText} />
            <p className="lightbox__caption">{filtered[lightbox.index].altText}</p>
          </div>
          <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); nextImage(); }}><ChevronRight size={32} /></button>
        </div>
      ) : null}
    </div>
  );
}
