import React from "react";
import { Link } from "react-router-dom";
import '../style/navbar.css';

function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/catalogo">Catalogo Carte</Link>
                </div>

                <div className="navbar-user-actions">
                    {!user ? (
                        <Link to="/login" className="navbar-button">Login</Link>
                    ) : (
                        <>
                            <span className="navbar-user">Ciao, {user?.nome || 'Utente'}</span>
                            <button className="logout-button" onClick={onLogout}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
