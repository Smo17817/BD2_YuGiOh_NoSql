import React, { useEffect, useState, useRef } from 'react';
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

    const imageRef = useRef(null);

    function handleMouseMove(e) {
        const card = imageRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Oscillazione aumentata
        const rotateX = -(y - centerY) / 5; 
        const rotateY = (x - centerX) / 5;

        // Ombra dinamica che segue il mouse
        const shadowX = -(x - centerX) / 10;
        const shadowY = -(y - centerY) / 10;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.5)`;
    }

    function handleMouseLeave() {
        const card = imageRef.current;
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
    }

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
                    <img
                        ref={imageRef}
                        src={carta.image_url}
                        alt={carta.name}
                        className="carta-image"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    />
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
