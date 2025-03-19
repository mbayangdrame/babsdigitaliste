// import logo from './img/image1.png';

import { Routes, Route } from 'react-router-dom';
import CategoryPortfolio from './components/CategoryPortfolio';
import Home from './pages/Home';
import About from './pages/About';
import Service from './pages/Services';
import PortfolioDetail from './pages/PortfolioDetail';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import Footer from './components/Footer';

function App() {

  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Service />} />
        <Route path="/portfoliodetail/:category/:id" element={<PortfolioDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/portfolio/:category" element={<CategoryPortfolio />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;