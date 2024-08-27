import { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { expandLink } from '../fetches/expandLink';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(expandLink('/api/auth/signin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Nieprawidłowe dane logowania');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Logowanie</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group password-group">
          <label htmlFor="password">Hasło:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="toggle-password" onClick={toggleShowPassword}>
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button">Zaloguj się</button>
        <Link to="/register" className="register-link">Zarejestruj się</Link>
      </form>
    </div>
  );
}

export default Login;
