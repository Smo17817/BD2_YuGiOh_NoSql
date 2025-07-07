import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                onLogin(data.user);      // setta utente nel genitore
                navigate("/"); // reindirizza alla home
            } else {
                setMessage(data.error || 'Credenziali non valide');
            }
        } catch (err) {
            setMessage('Errore di rete');
        }
    };

    return (
        <div id="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    id="login-email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <div className="password-wrapper">
                    <input
                        id="login-password"
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
                <button id="login-submit" type="submit">Accedi</button>
            </form>
            {message && <p id="login-message">{message}</p>}
            <p id="signup-link">
                Non sei iscritto?{' '}
                <Link to="/signup">Iscriviti!</Link>
            </p>
        </div>
    );
}

export default Login;
