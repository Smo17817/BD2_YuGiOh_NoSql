import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/carta.css';

function Carta({ user }) {
    const { id } = useParams();
    const [carta, setCarta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPreferita, setIsPreferita] = useState(false);
    const [loadingPreferiti, setLoadingPreferiti] = useState(false);
    const [errorPreferiti, setErrorPreferiti] = useState(null);

    const userEmail = user?.email || null;

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

    // Carica preferiti solo se loggato
    useEffect(() => {
        if (!userEmail) {
            setIsPreferita(false);
            return;
        }
        setLoadingPreferiti(true);
        setErrorPreferiti(null);

        fetch(`http://127.0.0.1:5000/preferiti/${encodeURIComponent(userEmail)}`)
            .then(res => {
                if (!res.ok) throw new Error("Errore nel recupero preferiti");
                return res.json();
            })
            .then(data => {
                const preferiti = data.preferiti || [];
                setIsPreferita(preferiti.includes(id));
                setLoadingPreferiti(false);
            })
            .catch(err => {
                console.error(err);
                setErrorPreferiti(err.message);
                setLoadingPreferiti(false);
            });
    }, [id, userEmail]);

    function aggiungiPreferito() {
        if (!userEmail) return;
        fetch(`http://127.0.0.1:5000/preferiti/${encodeURIComponent(userEmail)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_carta: id })
        })
            .then(res => res.json())
            .then(() => setIsPreferita(true))
            .catch(err => console.error(err));
    }

    function rimuoviPreferito() {
        if (!userEmail) return;
        fetch(`http://127.0.0.1:5000/preferiti/${encodeURIComponent(userEmail)}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_carta: id })
        })
            .then(res => res.json())
            .then(() => setIsPreferita(false))
            .catch(err => console.error(err));
    }

    if (loading) return <p>Caricamento...</p>;
    if (!carta) return <p>Carta non trovata</p>;

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

                    {userEmail ? (
                        loadingPreferiti ? (
                            <p>Caricamento preferiti...</p>
                        ) : errorPreferiti ? (
                            <p>Errore: {errorPreferiti}</p>
                        ) : (
                            <button onClick={() => {
                                if (isPreferita) {
                                    rimuoviPreferito();
                                } else {
                                    aggiungiPreferito();
                                }
                            }}>
                                {isPreferita ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                            </button>
                        )
                    ) : (
                        <p>Effettua il login per aggiungere ai preferiti</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Carta;
