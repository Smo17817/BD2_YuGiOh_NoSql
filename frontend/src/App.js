import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Carta from './pages/Carta';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div style={{ minHeight: '80vh', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/carta/:id" element={<Carta />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} /> 
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
