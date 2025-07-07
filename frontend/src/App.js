import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Carta from './pages/Carta';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ minHeight: '80vh', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/carta/:id" element={<Carta />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
