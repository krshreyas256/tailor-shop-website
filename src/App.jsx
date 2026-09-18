import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Hero from './sections/Hero';
import Services from './sections/Services';
import Gallery from './sections/Gallery';
import About from './sections/About';
import CustomDesign from './sections/CustomDesign';

function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Services />
        <Gallery />
        <About />
        <CustomDesign />
      </main>

      <Footer />
    </>
  );
}

export default App;