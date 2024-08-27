import { useNavigate } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="section">
        <h2>Organizer</h2>
        <ul>
          <li onClick={() => navigate('/home')}>Mój plan</li>
        </ul>
      </div>
      <div className="section">
        <h2>Profil</h2>
        <ul>
          <li onClick={() => navigate('/profile')}>Mój Profil</li>
          <li onClick={() => navigate('/edit-profile')}>Zmień dane profilu</li>
          <li onClick={() => navigate('/change-password')}>Zmień hasło</li>
        </ul>
      </div>
      <div className="logout-section">
        <ul>
          <li onClick={handleLogout} className="logout-button">Wyloguj się</li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
