import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Hero from './sections/Hero';
import Services from './sections/Services';
import Gallery from './sections/Gallery';
import About from './sections/About';
import CustomDesign from './sections/CustomDesign';
import VisitUs from './sections/VisitUs';

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './admin/ProtectedRoute';


function PublicHome() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Services />
        <Gallery />
        <About />
        <CustomDesign />
        <VisitUs />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<PublicHome />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;