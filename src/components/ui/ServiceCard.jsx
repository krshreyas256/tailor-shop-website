function ServiceCard({ title, description, image }) {
  return (
    <article className="service-card">
      <div className="service-card-image-wrapper">
        <img
          src={image}
          alt={title}
          className="service-card-image"
        />
      </div>

      <div className="service-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}

export default ServiceCard;