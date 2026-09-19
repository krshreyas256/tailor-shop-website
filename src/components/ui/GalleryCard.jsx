import '../../styles/gallery.css';

function GalleryCard({ image, title }) {
  return (
    <article className="gallery-card">
      <div className="gallery-image-wrapper">

        <img
          src={image}
          alt={title}
          loading="lazy"
        />

        <div className="gallery-card-overlay">
          <h3>{title}</h3>
        </div>

      </div>
    </article>
  );
}

export default GalleryCard;