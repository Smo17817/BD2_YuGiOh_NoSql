import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/signup.css';

function Signup() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const validatePassword = (pw) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pw);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validatePassword(password)) {
        setMessage('La password deve avere almeno 6 caratteri, con almeno una lettera e un numero.');
        return;
        }
        if (password !== confirmPassword) {
        setMessage('Le password non corrispondono.');
        return;
        }
        try {
            const res = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Registrazione avvenuta con successo!');
                setNome('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                setMessage(data.error || 'Errore nella registrazione');
            }
        } catch {
        setMessage('Errore di rete');
        }
    };

    return (
        <div id="signup-container">
        <h2>Registrati</h2>
        <form onSubmit={handleSignup}>
            <input
            id="signup-name"
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
            />
            <input
            id="signup-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            />

            <div className="password-wrapper">
            <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
            >
                {showPassword ? 'X' : 'O'}
            </button>
            </div>

            <div className="password-wrapper">
            <input
                id="signup-confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Conferma Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
            />
            <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Nascondi conferma password' : 'Mostra conferma password'}
            >
                {showConfirm ? 'X' : 'O'}
            </button>
            </div>

            <button id="signup-submit" type="submit">Registrati</button>
        </form>
        {message && <p id="signup-message">{message}</p>}
        <p id="login-link">
            Hai già un account?{' '}
            <Link to="/login">Accedi!</Link>
        </p>
        </div>
    );
}

export default Signup;
