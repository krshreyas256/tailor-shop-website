import '../styles/hero.css';

function Hero() {
  const whatsappNumber = '918792931352';
  const whatsappMessage = encodeURIComponent(
    'Hello Prema Tailor, I would like to know more about your tailoring services.'
  );

  return (
    <section className="hero" id="home">
      <div className="hero-container">

        <div className="hero-content">
          <p className="hero-subtitle">CRAFTED WITH CARE</p>

          <h1>
            Stitched to
            <br />
            Perfection.
          </h1>

          <p className="hero-description">
            Thoughtfully tailored garments crafted with care,
            precision, and attention to every detail.
          </p>

          <div className="hero-actions">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              className="hero-btn hero-btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>

            <a
              href="#custom-design"
              className="hero-btn hero-btn-secondary"
            >
              Request a Design
            </a>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85"
            alt="Tailoring and garment craftsmanship"
            className="hero-image"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;