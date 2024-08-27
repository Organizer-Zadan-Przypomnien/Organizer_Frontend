import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import { expandLink } from '../fetches/expandLink';
import './changePassword.css';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Nowe hasła nie pasują do siebie.");
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setError("Hasło musi zawierać co najmniej 1 dużą literę, 1 małą literę, 1 cyfrę oraz 1 znak specjalny.");
            return;
        }

        try {
            const response = await fetch(expandLink('/api/user/postPassword'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                switch (response.status) {
                    case 400:
                        if (data.message.includes("All fields are required")) {
                            setError("Wszystkie pola są wymagane.");
                        } else if (data.message.includes("New passwords do not match")) {
                            setError("Nowe hasła nie pasują do siebie.");
                        } else if (data.message.includes("Old password is incorrect")) {
                            setError("Stare hasło jest niepoprawne.");
                        } else if (data.message.includes("New password must be different")) {
                            setError("Nowe hasło musi być inne niż stare.");
                        } else {
                            setError("Błąd wprowadzenia danych.");
                        }
                        break;
                    case 404:
                        setError("Użytkownik nie został znaleziony.");
                        break;
                    default:
                        setError(data.message || 'Coś poszło nie tak.');
                }
                return;
            }

            setSuccess("Hasło zostało pomyślnie zmienione.");
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                navigate('/profile', { replace: true });
            }, 2000);

        } catch (err) {
            setError("Wystąpił błąd podczas zmiany hasła.");
        }
    };

    return (
        <div className="main-container">
            <Sidebar />
            <div className="change-password-container">
                <h2>Zmień hasło</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Stare hasło:</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Nowe hasło:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Potwierdź nowe hasło:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <button type="submit" className="save-button">Zmień hasło</button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
