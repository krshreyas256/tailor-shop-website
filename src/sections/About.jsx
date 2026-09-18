import '../styles/about.css';

function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="section-header about-header">
          <p className="section-subtitle">About Us</p>

          <h2 className="section-title">
            Crafted with Care,
            <br />
            Made to Fit.
          </h2>

          <p className="section-description about-intro">
            Every garment is thoughtfully stitched with attention
            to detail, comfort, and personal style.
          </p>
        </div>

        <div className="about-divider"></div>

        <div className="about-text">
          <p>
            At Prema Tailoring & Design, we believe that every
            garment should feel as good as it looks. With careful
            attention to detail and a commitment to quality,
            we create garments tailored to suit your individual
            style and requirements.
          </p>

          <p>
            From everyday wear to special occasions, every piece
            is stitched with care and precision to give you a
            comfortable and confident fit.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;