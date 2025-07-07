import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/carta.css';

function Carta() {
    const { id } = useParams();
    const [carta, setCarta] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`http://127.0.0.1:5000/carta/${id}`)
        .then(res => res.json())
        .then(data => {
            setCarta(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <p>Caricamento...</p>;
    if (!carta) return <p>Carta non trovata</p>;

    // Gestione numeri in modo sicuro
    const atk = Number.isNaN(parseInt(carta.atk)) ? null : parseInt(carta.atk);
    const def = Number.isNaN(parseInt(carta.def)) ? null : parseInt(carta.def);
    const level = Number.isNaN(parseInt(carta.level)) ? null : parseInt(carta.level);

    return (
    <div className="carta-container">
        <h1>{carta.name}</h1>
        <div className="carta-content">
        {carta.image_url && (
            <img src={carta.image_url} alt={carta.name} className="carta-image" />
        )}
        <div className="carta-info">
            <p>Tipo: {carta.type || '-'}</p>
            <p>Attributo: {carta.attribute || '-'}</p>
            <p>Livello: {level !== null ? level : '-'}</p>
            <p>ATK: {atk !== null ? atk : '-'}</p>
            <p>DEF: {def !== null ? def : '-'}</p>
            <div className="carta-desc">
            <strong>Descrizione:</strong>
            <p>{carta.desc || '-'}</p>
            </div>
        </div>
        </div>
    </div>
    );
}

export default Carta;
