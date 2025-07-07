import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';  // import dal file esterno

function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
      <Link to="/catalogo">Catalogo Carte</Link>
    </nav>
  );
}

function Catalogo() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Catalogo Carte</h1>
      <p>Qui mostreremo la lista delle carte.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
      </Routes>
    </Router>
  );
}

export default App;
