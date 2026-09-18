import '../../styles/footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>Prema Tailoring & Design</h2>
          <p>
            Crafted with care, stitched to fit.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} Prema Tailoring & Design. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;