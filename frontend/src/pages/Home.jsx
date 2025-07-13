import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/catalogo.css';
import '../style/home.css'; 
import slide1 from '../images/whiteDragon.png';
import slide2 from '../images/cards.png';
import slide3 from '../images/yugi.png';

function Home() {
    const [carte, setCarte] = useState([]);
    const [slideIndex, setSlideIndex] = useState(0);
    const [animate, setAnimate] = useState(false);

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

    // Riavvia l’animazione ogni volta che cambia slideIndex
    useEffect(() => {
        setAnimate(false);
        const timeout = setTimeout(() => setAnimate(true), 10);
        return () => clearTimeout(timeout);
    }, [slideIndex]);

    const slides = [
        {
            title: "Benvenuto in Yu-Gi-Oh! Catalog",
            description: "Evoca i tuoi mostri, lancia magie e combatti in duelli epici.",
            image: slide1,
        },
        {
            title: "Esplora il nostro Catalogo",
            description: "Scopri centinaia di carte leggendarie pronte per il tuo deck.",
            image: slide2,
            link: "/catalogo"
        },
        {
            title: "Diventa un Campione dei Duelli!",
            description: "Crea un account per salvare le tue carte preferite.",
            image: slide3,
            link: "/register"
        }
    ];

    const nextSlide = () => setSlideIndex((slideIndex + 1) % slides.length);
    const prevSlide = () => setSlideIndex((slideIndex - 1 + slides.length) % slides.length);

    return (
        <div className="home-wrapper">
            {/* Carosello Intro */}
            <div className="intro-carousel">
                <button className="carousel-btn left" onClick={prevSlide}>&lt;</button>

                <div className="slide">
                    <div className="slide-inner">
                        <div className={`slide-content ${animate ? 'fade-in' : ''}`}>
                            <h2>{slides[slideIndex].title}</h2>
                            <p>{slides[slideIndex].description}</p>
                            {slides[slideIndex].link && (
                                <Link to={slides[slideIndex].link} className="carousel-link">
                                    Scopri di più
                                </Link>
                            )}
                        </div>
                        <img 
                            src={slides[slideIndex].image} 
                            alt="slide" 
                            className={animate ? 'fade-in' : ''} 
                            style={{ animationDelay: '0.2s' }}
                        />
                    </div>
                </div>

                <button className="carousel-btn right" onClick={nextSlide}>&gt;</button>
            </div>

            {/* Carte in evidenza (non modificata) */}
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
        </div>
    );
}

export default Home;
