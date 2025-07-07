import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/catalogo.css';

function Preferiti({ user }) {
    const [preferitiIds, setPreferitiIds] = useState([]);
    const [carte, setCarte] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) {
        setPreferitiIds([]);
        setCarte([]);
        setLoading(false);
        return;
        }

        setLoading(true);
        fetch(`http://localhost:5000/preferiti/${encodeURIComponent(user.email)}`)
        .then(res => {
            if (!res.ok) throw new Error('Errore nel fetch preferiti');
            return res.json();
        })
        .then(data => {
            const ids = data.preferiti || [];
            setPreferitiIds(ids);

            // Fetch dettagli carte preferite
            return Promise.all(
            ids.map(id =>
                fetch(`http://127.0.0.1:5000/carta/${id}`)
                .then(res => res.ok ? res.json() : null)
                .catch(() => null)
            )
            );
        })
        .then(carteData => {
            // Filtra carte valide (non null)
            setCarte(carteData.filter(c => c));
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [user]);

    if (!user?.email) {
        return <p>Devi effettuare il login per vedere i preferiti.</p>;
    }

    if (loading) {
        return <p>Caricamento preferiti...</p>;
    }

    if (carte.length === 0) {
        return <p>Nessuna carta preferita trovata.</p>;
    }

    return (
        <div className="catalogo-container">
        <h1>Preferiti</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {carte.map(c => (
            <Link key={c._id} to={`/carta/${c._id}`} className="card-link">
                <div className="card">
                <h3>{c.name}</h3>
                {c.image_url && <img src={c.image_url} alt={c.name} />}
                <p>Tipo: {c.type || '-'}</p>
                {c.attribute && <p>Attributo: {c.attribute}</p>}
                {c.level && <p>Livello: {c.level}</p>}
                {c.atk && <p>ATK: {c.atk}</p>}
                {c.def && <p>DEF: {c.def}</p>}
                </div>
            </Link>
            ))}
        </div>
        </div>
    );
}

export default Preferiti;
