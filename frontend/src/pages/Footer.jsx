import React from "react";
import '../style/footer.css';

function Footer() {
    return (
        <footer className="footer">
        <p>© {new Date().getFullYear()} Yugioh Catalog. Tutti i diritti riservati.</p>
        </footer>
    );
}

export default Footer;
