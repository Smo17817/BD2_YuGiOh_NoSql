import React, { useState } from 'react';
import '../style/profilo.css';

function Profilo({ user, onUpdate }) {
    const [formData, setFormData] = useState({
        nome: user?.nome || '',
        email: user?.email || '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    // Stato toggle per ogni campo password
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword || formData.confirmNewPassword) {
            if (formData.newPassword !== formData.confirmNewPassword) {
                setMessage('Le nuove password non corrispondono.');
                return;
            }
            if (formData.newPassword.length < 8) {
                setMessage('La nuova password deve essere lunga almeno 8 caratteri.');
                return;
            }
            if (!formData.oldPassword) {
                setMessage('Inserisci la vecchia password per modificarla.');
                return;
            }
        }

        const dataToSend = {
            nome: formData.nome,
        };
        if (formData.newPassword) {
            dataToSend.oldPassword = formData.oldPassword;
            dataToSend.newPassword = formData.newPassword;
        }

        try {
            const res = await fetch(`http://127.0.0.1:5000/utente/${user.email}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Profilo aggiornato con successo');
                onUpdate(data.updatedUser);
                setFormData(prev => ({
                    ...prev,
                    oldPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                }));
            } else {
                setMessage(data.error || 'Errore aggiornamento');
            }
        } catch (err) {
            setMessage('Errore di rete');
        }
    };

    return (
        <div id="profilo-container">
            <h2>Il tuo profilo</h2>
            <form onSubmit={handleSubmit} className="profilo-form">
                <label>
                    Nome:
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email (non modificabile):
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                    />
                </label>
                <hr />

                <label>
                    Vecchia password:
                    <div className="password-wrapper">
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            aria-label={showOldPassword ? 'Nascondi password' : 'Mostra password'}
                        >
                            {showOldPassword ? 'X' : 'O'}
                        </button>
                    </div>
                </label>

                <label>
                    Nuova password:
                    <div className="password-wrapper">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            aria-label={showNewPassword ? 'Nascondi password' : 'Mostra password'}
                        >
                            {showNewPassword ? 'X' : 'O'}
                        </button>
                    </div>
                </label>

                <label>
                    Conferma nuova password:
                    <div className="password-wrapper">
                        <input
                            type={showConfirmNewPassword ? 'text' : 'password'}
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            aria-label={showConfirmNewPassword ? 'Nascondi password' : 'Mostra password'}
                        >
                            {showConfirmNewPassword ? 'X' : 'O'}
                        </button>
                    </div>
                </label>

                <button type="submit">Salva modifiche</button>
            </form>
            {message && <p id="profilo-message">{message}</p>}
        </div>
    );
}

export default Profilo;
