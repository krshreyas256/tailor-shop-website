import ServiceCard from '../components/ui/ServiceCard';
import '../styles/services.css';

const services = [
  {
    title: 'Blouse Stitching',
    description:
      'Custom blouse stitching designed according to your style and requirements.',
    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Dress Stitching',
    description:
      'Well-fitted dresses crafted with attention to detail and finishing.',
    image:
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Uniform Stitching',
    description:
      'Comfortable and neatly finished uniforms tailored to your requirements.',
    image:
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Custom Tailoring',
    description:
      'Personalized stitching for garments based on your preferred design and fit.',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
  },
];

function Services() {
  return (
    <section className="section section-cream services" id="services">
      <div className="container">

        <div className="section-header">
          <p className="section-subtitle">Our Services</p>

          <h2 className="section-title">
            What we Offer
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