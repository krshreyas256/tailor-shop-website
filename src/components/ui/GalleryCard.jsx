function GalleryCard({ image, title }) {
  return (
    <article className="gallery-card">
      <button
        type="button"
        className="gallery-image-button"
        aria-label={`View ${title}`}
      >
        <img
          src={image}
          alt={title}
          className="gallery-image"
        />

        <div className="gallery-overlay">
          <span>{title}</span>
        </div>
      </button>
    </article>
  );
}

export default GalleryCard;