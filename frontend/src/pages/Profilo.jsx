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

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validazione lato client
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

        // Prepara dati da inviare (non inviare campi password vuoti)
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
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Nuova password:
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Conferma nuova password:
                    <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Salva modifiche</button>
            </form>
            {message && <p id="profilo-message">{message}</p>}
        </div>
    );
}

export default Profilo;
