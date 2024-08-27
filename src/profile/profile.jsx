import { useEffect, useState } from 'react';
import Sidebar from '../sidebar/sidebar';
import { expandLink } from '../fetches/expandLink';
import './profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(expandLink('/api/user/getUserDetails'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Nie udało się pobrać danych użytkownika');
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="profile-content">
        <div className="profile-header">
          <img src={userData.avatar} alt="Avatar" className="profile-avatar" />
          <h1>{userData.username}</h1>
          <p className="profile-email">{userData.email}</p>
        </div>
        <div className="profile-details">
          <div className="profile-detail">
            <strong>Kraj:</strong> {userData.country}
          </div>
          <div className="profile-detail">
            <strong>Miasto:</strong> {userData.city || 'Nie podano'}
          </div>
          <div className="profile-detail">
            <strong>Język:</strong> {userData.language}
          </div>
          <div className="profile-about">
            <strong>O mnie:</strong> {userData.about || 'Brak informacji'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
