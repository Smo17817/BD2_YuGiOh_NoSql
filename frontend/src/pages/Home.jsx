import React, { useEffect, useState } from 'react';

function Home() {
    const [carte, setCarte] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/carte?limit=10')
        .then(res => res.json())
        .then(data => setCarte(data))
        .catch(console.error);
    }, []);

    return (
        <div>
        <h1>Carte in evidenza</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {carte.map(carta => (
            <div key={carta._id} style={{ border: '1px solid #ccc', padding: '10px', width: '150px' }}>
                <h3>{carta.name || carta.nome || 'Carta'}</h3>
                {/* Se hai un'immagine */}
                {carta.image_url && <img src={carta.image_url} alt={carta.name} style={{ width: '100%' }} />}
            </div>
            ))}
        </div>
        </div>
    );
}

export default Home;