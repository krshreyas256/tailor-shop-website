import { useState } from 'react';
import '../styles/visit-us.css';

function VisitUs() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const timeSlots = [
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
    '5:00 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setSubmitted(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service.';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a preferred date.';
    }

    if (!formData.time) {
      newErrors.time = 'Please select a preferred time.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('Visit request:', formData);

    setSubmitted(true);

    setFormData({
      name: '',
      phone: '',
      service: '',
      date: '',
      time: '',
      message: '',
    });

    event.target.reset();
  };

  return (
    <section className="section visit-us" id="visit-us">
      <div className="container">

        <div className="section-header visit-header">
          <p className="section-subtitle">Visit Us</p>

          <h2 className="section-title">
            Let's Create Something
            <br />
            You'll Love.
          </h2>

          <p className="section-description">
            Have questions, need a fitting, or want to discuss
            your design in person? We'd be happy to welcome you.
          </p>
        </div>

        <div className="visit-info">

          <div className="visit-info-item">
            <span className="visit-info-label">Address</span>

            <p>
              Opposite to Jr. College Kambadakone
            </p>
          </div>

          <div className="visit-info-item">
            <span className="visit-info-label">Phone</span>

            <a
              href="tel:+918792931352"
              className="visit-action-button"
            >
              Click Here to Call
            </a>
          </div>

          <div className="visit-info-item">
            <span className="visit-info-label">WhatsApp</span>

            <a
              href="https://wa.me/918792931352"
              target="_blank"
              rel="noopener noreferrer"
              className="visit-action-button"
            >
              Chat with Us
            </a>
          </div>

        </div>

        <div className="visit-map">
          <iframe
            title="Prema Tailoring & Design location"
            src="https://www.google.com/maps?q=Opposite%20to%20Jr.%20College%20Kambadakone&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="visit-request">

          <div className="visit-request-intro">
            <p className="section-subtitle">Plan Your Visit</p>

            <h3>
              Tell us when
              <br />
              you'd like to come.
            </h3>

            <p>
              Send us your preferred date and time, and we'll
              get in touch with you to confirm your visit.
            </p>
          </div>

          <div className="visit-form-wrapper">
            <form
              className="visit-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="visit-name">
                  Name <span>*</span>
                </label>

                <input
                  type="text"
                  id="visit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                />

                {errors.name && (
                  <p className="form-error">{errors.name}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="visit-phone">
                  Phone Number <span>*</span>
                </label>

                <input
                  type="tel"
                  id="visit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  inputMode="numeric"
                  autoComplete="tel"
                />

                {errors.phone && (
                  <p className="form-error">{errors.phone}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="visit-service">
                  Service <span>*</span>
                </label>

                <select
                  id="visit-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="">Select a service</option>
                  <option value="Blouse">Blouse</option>
                  <option value="Dress">Dress</option>
                  <option value="Uniform">Uniform</option>
                  <option value="Other">Other</option>
                </select>

                {errors.service && (
                  <p className="form-error">{errors.service}</p>
                )}
              </div>

              <div className="visit-form-row">
                <div className="form-group">
                  <label htmlFor="visit-date">
                    Preferred Date <span>*</span>
                  </label>

                  <input
                    type="date"
                    id="visit-date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                  />

                  {errors.date && (
                    <p className="form-error">{errors.date}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="visit-time">
                    Preferred Time <span>*</span>
                  </label>

                  <select
                    id="visit-time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  >
                    <option value="">Select time</option>

                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>

                  {errors.time && (
                    <p className="form-error">{errors.time}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="visit-message">
                  Message
                  <span className="optional">Optional</span>
                </label>

                <textarea
                  id="visit-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Anything you'd like us to know..."
                  rows="4"
                />
              </div>

              {submitted && (
                <div className="form-success">
                  Thank you! Your visit request has been submitted.
                </div>
              )}

              <button
                type="submit"
                className="visit-submit"
              >
                Request a Visit
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}

export default VisitUs;