import { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import { expandLink } from '../fetches/expandLink';
import './editProfile.css';

const EditProfile = () => {
    const [username, setUsername] = useState('');
    const [about, setAbout] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [language, setLanguage] = useState('');
    const [languages, setLanguages] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        const fetchLanguages = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(expandLink('/api/user/getLanguages'), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLanguages(data);
            } else {
                console.error('Nie udało się pobrać języków');
            }
        };

        fetchLanguages();
    }, []);

    const handleSaveChanges = async () => {
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem('token');

            if (avatar) {
                const formData = new FormData();
                formData.append('avatar', avatar);

                const avatarResponse = await fetch(expandLink('/api/user/postAvatarFile'), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!avatarResponse.ok) {
                    throw new Error('Nie udało się zaktualizować awatara.');
                }
            }

            if (username) {
                const usernameResponse = await fetch(expandLink('/api/user/postUsername'), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username }),
                });

                if (!usernameResponse.ok) {
                    throw new Error('Nazwa użytkownika jest już zajęta lub wystąpił inny błąd.');
                }
            }

            if (about) {
                await fetch(expandLink('/api/user/postAbout'), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ about }),
                });
            }

            if (country) {
                await fetch(expandLink('/api/user/postCountry'), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ country }),
                });
            }

            if (city) {
                await fetch(expandLink('/api/user/postCity'), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ city }),
                });
            }

            if (language) {
                await fetch(expandLink('/api/user/postLanguage'), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ languageId: parseInt(language) }),
                });
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    return (
        <div className="edit-profile-main-container">
            <Sidebar />
            <div className="edit-profile-container">
                <h2>Zmień dane profilu</h2>
                {error && <p className="edit-profile-error-message">{error}</p>}
                {success && <p className="edit-profile-success-message">Profil został pomyślnie zaktualizowany!</p>}
                <div className="edit-profile-form-group">
                    <label htmlFor="username">Nazwa użytkownika:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="edit-profile-form-group">
                    <label htmlFor="about">O mnie:</label>
                    <textarea
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                </div>
                <div className="edit-profile-form-group">
                    <label htmlFor="country">Kraj:</label>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
                <div className="edit-profile-form-group">
                    <label htmlFor="city">Miasto:</label>
                    <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <div className="edit-profile-form-group">
                    <label htmlFor="language">Język:</label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="">Wybierz język</option>
                        {languages.map((lang) => (
                            <option key={lang.ID_LANGUAGE} value={lang.ID_LANGUAGE}>
                                {lang.LANGUAGE}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="edit-profile-form-group">
                    <label htmlFor="avatar">Awatar:</label>
                    <input type="file" id="avatar" accept="image/*" onChange={handleAvatarChange} />
                    {avatarPreview && (
                        <div className="edit-profile-avatar-preview">
                            <img src={avatarPreview} alt="Podgląd awatara" />
                        </div>
                    )}
                </div>
                <button className="edit-profile-save-button" onClick={handleSaveChanges}>
                    Zapisz zmiany
                </button>
            </div>
        </div>
    );
};

export default EditProfile;
