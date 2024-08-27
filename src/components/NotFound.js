import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        } else {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return null;
};

export default NotFound;
