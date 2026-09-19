import ServiceCard from '../components/ui/ServiceCard';
import '../styles/services.css';

import blouseStitchingImage from '../assets/blouse-stitching.png';
import dressStitchingImage from '../assets/dress-stitching.png';
import uniformStitchingImage from '../assets/uniform-stitching.png';
import customTailoringImage from '../assets/custom-tailoring.png';

const services = [
  {
    title: 'Blouse Stitching',
    description:
      'Custom blouse stitching designed according to your style and requirements.',
    image: blouseStitchingImage,
  },
  {
    title: 'Dress Stitching',
    description:
      'Well-fitted dresses crafted with attention to detail and finishing.',
    image: dressStitchingImage,
  },
  {
    title: 'Uniform Stitching',
    description:
      'Comfortable and neatly finished uniforms tailored to your requirements.',
    image: uniformStitchingImage,
  },
  {
    title: 'Custom Tailoring',
    description:
      'Personalized stitching for garments based on your preferred design and fit.',
    image: customTailoringImage,
  },
];

function Services() {
  return (
    <section className="section section-cream services" id="services">
      <div className="container">

        <div className="section-header">
          <p className="section-subtitle">Our Services</p>

          <h2 className="section-title">
            What We Offer
          </h2>

          <p className="section-description">
            Tailoring crafted with care, precision, and attention
            to your individual style and requirements.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              image={service.image}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Services;