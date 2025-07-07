import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/catalogo.css';

function Home() {
    const [carte, setCarte] = useState([]);

    // Funzione helper per pulire valori NaN o null/undefined
    const cleanValue = (val) => {
        if (val === null || val === undefined) return 'N/A';
        if (typeof val === 'number' && isNaN(val)) return 'N/A';
        return val;
    };

    useEffect(() => {
        fetch('http://127.0.0.1:5000/carte/upvotes')
        .then(res => res.json())
        .then(data => setCarte(data))
        .catch(console.error);
    }, []);

    if (carte.length === 0) {
        return <p>Non ci sono carte in evidenza al momento.</p>;
    }

    return (
        <div className="catalogo-container">
        <h1>Carte in evidenza</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {carte.map(carta => (
            <Link key={carta._id} to={`/carta/${carta._id}`} className="card-link">
                <div className="card">
                <h3>{cleanValue(carta.name) || cleanValue(carta.nome) || 'Carta'}</h3>
                {carta.image_url && <img src={carta.image_url} alt={cleanValue(carta.name)} />}
                <p>ATK: {cleanValue(carta.atk)}</p>
                <p>DEF: {cleanValue(carta.def)}</p>
                <p>Livello: {cleanValue(carta.level)}</p>
                </div>
            </Link>
            ))}
        </div>
        </div>
    );
}

export default Home;
