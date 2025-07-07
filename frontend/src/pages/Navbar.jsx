import React from "react";
import { Link } from "react-router-dom";
import '../style/navbar.css'; // stile personalizzato (opzionale)

function Navbar() {
    return (
        <nav className="navbar">
        <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/catalogo">Catalogo Carte</Link>
            <Link to="/login">Login</Link>
        </div>
        </nav>
    );
}

export default Navbar;
