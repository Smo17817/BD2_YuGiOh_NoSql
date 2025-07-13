import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './style/App.css';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Carta from './pages/Carta';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profilo from './pages/Profilo';
import Preferiti from './pages/Preferiti';

function App() {
  // Inizializza lo stato leggendo da localStorage (una sola volta)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Quando l'utente cambia, aggiorna localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    // localStorage aggiornato automaticamente dall'useEffect
  };

  const handleLogout = () => {
    setUser(null);
    // localStorage rimosso automaticamente dall'useEffect
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div style={{ minHeight: '80vh', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/carta/:id" element={<Carta user={user} />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profilo" element={user ? <Profilo user={user} onUpdate={setUser} /> : <Navigate to="/login" />} />
          <Route path="/preferiti" element={user ? <Preferiti user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
