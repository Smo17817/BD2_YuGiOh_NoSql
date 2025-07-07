import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import '../style/navbar.css';

function Navbar({ user, onLogout }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const handleLogoutClick = () => {
        onLogout();         // cancella l'utente
        closeSidebar();     // chiude la sidebar
        navigate("/");      // reindirizza alla home
    };
    return (
        <>
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
                            <button className="navbar-user" onClick={toggleSidebar}>
                                Ciao, {user?.nome || 'Utente'} ☰
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}>
                    <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeSidebar}>×</button>
                        <Link to="/profilo" onClick={closeSidebar}>Profilo</Link>
                        <Link to="/preferiti" onClick={closeSidebar}>Carte preferite</Link>
                        <button onClick={handleLogoutClick}>Logout</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
