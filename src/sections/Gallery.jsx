import { useEffect, useState } from 'react';

import GalleryCard from '../components/ui/GalleryCard';
import { getDocuments, COLLECTIONS } from '../firebase/firestore';

import '../styles/gallery.css';

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const items = await getDocuments(COLLECTIONS.GALLERY);
        setGalleryItems(items);
      } catch (error) {
        console.error('Gallery loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  return (
    <section className="section gallery" id="gallery">
      <div className="container">

        <div className="section-header gallery-header">
          <p className="section-subtitle">
            Our Work
          </p>

          <h2 className="section-title">
            A Glimpse of Our Craft
          </h2>

          <p className="section-description">
            Explore some of the garments crafted with care
            and attention to detail.
          </p>
        </div>

        {loading ? (
          <div className="gallery-message">
            <p>Loading gallery...</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="gallery-message">
            <p>
              Our latest work will be showcased here soon.
            </p>
          </div>
        ) : (
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <GalleryCard
                key={item.id}
                image={item.imageUrl}
                title={item.title}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Gallery;