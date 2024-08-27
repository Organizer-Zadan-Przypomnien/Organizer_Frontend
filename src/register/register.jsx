import { useState } from 'react';
import './register.css';
import { Link } from 'react-router-dom';
import { expandLink } from '../fetches/expandLink';

function Register() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let valid = true;

    if (!validatePassword(password)) {
      setPasswordError('Hasło musi zawierać co najmniej 1 dużą literę, 1 małą literę, 1 cyfrę oraz 1 znak specjalny.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Hasła nie są takie same.');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (valid) {
      try {
        const response = await fetch(expandLink('/api/auth/signup'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
            username: nickname,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.message.includes('username')) {
            setNicknameError('Ten nickname jest już zajęty.');
          } else {
            setNicknameError('');
          }
          if (data.message.includes('email')) {
            setEmailError('Ten email jest już zajęty.');
          } else {
            setEmailError('');
          }
          throw new Error('Błąd podczas rejestracji');
        }

        const data = await response.json();
        console.log('Rejestracja udana:', data);
        setSubmissionSuccess(true);
        setSubmissionError('');
      } catch (error) {
        setSubmissionError('Błąd podczas rejestracji. Spróbuj ponownie.');
        setSubmissionSuccess(false);
        console.error('Błąd:', error);
      }
    }
  };

  return (
    <div className="register-container">
      {submissionSuccess ? (
        <div className="success-message">
          <h2>Rejestracja udana!</h2>
          <p>Twoje konto zostało utworzone. Sprawdź swoją skrzynkę e-mail, aby potwierdzić rejestrację.</p>
          <Link to="/login" className="login-link">Przejdź do strony logowania</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Rejestracja</h2>
          <div className="form-group">
            <label htmlFor="nickname">Nickname:</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            {nicknameError && <p className="error">{nicknameError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="error">{emailError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">
              Hasło: <span className="tooltip">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <p className="error">{passwordError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Powtórz hasło:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
          </div>
          <button type="submit" className="register-button">Zarejestruj się</button>
          {submissionError && <p className="error">{submissionError}</p>}
          <Link to="/login" className="login-link">Przejdź do strony logowania</Link>
        </form>
      )}
    </div>
  );
}

export default Register;
