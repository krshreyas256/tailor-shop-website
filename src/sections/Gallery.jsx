import GalleryCard from '../components/ui/GalleryCard';
import '../styles/gallery.css';

const galleryItems = [
  {
    id: 1,
    title: 'Designer Blouse',
    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    title: 'Custom Dress',
    image:
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    title: 'Tailored Outfit',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    title: 'Traditional Wear',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 5,
    title: 'Custom Stitching',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 6,
    title: 'Tailoring Work',
    image:
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 7,
    title: 'Elegant Design',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 8,
    title: 'Custom Fit',
    image:
      'https://images.unsplash.com/photo-1506629905607-d9a3b5d7c9a0?auto=format&fit=crop&w=900&q=85',
  },
];

function Gallery() {
  return (
    <section className="section gallery" id="gallery">
      <div className="container">

        <div className="section-header">
          <p className="section-subtitle">OUR WORK</p>

          <h2 className="section-title">
            A Glimpse of Our Craft
          </h2>

          <p className="section-description">
            Explore some of the garments and designs crafted
            with care and attention to detail.
          </p>
        </div>

        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <GalleryCard
              key={item.id}
              image={item.image}
              title={item.title}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Gallery;