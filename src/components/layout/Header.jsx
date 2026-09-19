import { useState } from 'react';
import '../../styles/header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'About', href: '#about' },
    { name: 'Custom Design', href: '#custom-design' },
    { name: 'Visit Us', href: '#visit-us' },
  ];

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">

        <a
          href="#home"
          className="logo"
          aria-label="Prema Tailoring & Design"
        >
          <span className="logo-mark">
            <img
              src="/logo.png"
              alt=""
            />
          </span>

          <span className="logo-text">
            Prema Tailoring & Design
          </span>
        </a>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={handleNavClick}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
}

export default Header;