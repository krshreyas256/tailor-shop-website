import { useState } from 'react';
import '../styles/custom-design.css';

function CustomDesign() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    garmentType: '',
    description: '',
    referenceImage: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
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

    if (!formData.garmentType) {
      newErrors.garmentType = 'Please select a garment type.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('Custom design request:', formData);

    setSubmitted(true);

    setFormData({
      name: '',
      phone: '',
      garmentType: '',
      description: '',
      referenceImage: null,
    });

    event.target.reset();
  };

  return (
    <section className="section custom-design" id="custom-design">
      <div className="container">
        <div className="custom-design-layout">

          <div className="custom-design-content">
            <div className="section-header custom-design-header">
              <p className="section-subtitle">Custom Design</p>

              <h2 className="section-title">
                Have Something
                <br />
                Special in Mind?
              </h2>

              <p className="section-description">
                Tell us about the garment you have in mind.
                Share your requirements and we'll get in touch
                with you to discuss the details.
              </p>
            </div>

            <div className="custom-design-note">
              <span className="custom-design-note-mark">✦</span>

              <p>
                Have a reference image? You can attach it along
                with your request to help us understand your idea.
              </p>
            </div>
          </div>

          <div className="custom-design-form-wrapper">
            <form
              className="custom-design-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="name">
                  Name <span>*</span>
                </label>

                <input
                  type="text"
                  id="name"
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
                <label htmlFor="phone">
                  Phone Number <span>*</span>
                </label>

                <input
                  type="tel"
                  id="phone"
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
                <label htmlFor="garmentType">
                  Type of Garment <span>*</span>
                </label>

                <select
                  id="garmentType"
                  name="garmentType"
                  value={formData.garmentType}
                  onChange={handleChange}
                >
                  <option value="">Select garment type</option>
                  <option value="Blouse">Blouse</option>
                  <option value="Dress">Dress</option>
                  <option value="Uniform">Uniform</option>
                  <option value="Other">Other</option>
                </select>

                {errors.garmentType && (
                  <p className="form-error">{errors.garmentType}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="referenceImage">
                  Reference Image
                  <span className="optional">Optional</span>
                </label>

                <input
                  type="file"
                  id="referenceImage"
                  name="referenceImage"
                  accept="image/*"
                  onChange={handleChange}
                />

                <p className="form-hint">
                  You can attach an image of your preferred design.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Describe Your Requirement
                  <span className="optional">Optional</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your design, style, fitting, or any other requirements..."
                  rows="5"
                />
              </div>

              {submitted && (
                <div className="form-success">
                  Thank you! Your request has been submitted.
                </div>
              )}

              <button type="submit" className="custom-design-submit">
                Submit Request
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CustomDesign;