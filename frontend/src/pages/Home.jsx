import React, { useEffect, useState } from 'react';

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

    return (
        <div>
        <h1>Carte in evidenza</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {carte.map(carta => (
            <div key={carta._id} style={{ border: '1px solid #ccc', padding: '10px', width: '150px' }}>
                <h3>{cleanValue(carta.name) || cleanValue(carta.nome) || 'Carta'}</h3>
                {carta.image_url && <img src={carta.image_url} alt={cleanValue(carta.name)} style={{ width: '100%' }} />}
                
                {/* Esempio di campi numerici con gestione NaN */}
                <p>ATK: {cleanValue(carta.atk)}</p>
                <p>DEF: {cleanValue(carta.def)}</p>
                <p>Level: {cleanValue(carta.level)}</p>
                <p>Upvotes: {cleanValue(carta.upvotes)}</p>
            </div>
            ))}
        </div>
        </div>
    );
}

export default Home;
