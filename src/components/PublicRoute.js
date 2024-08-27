import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PublicRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? <Navigate to="/home" /> : children;
};

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PublicRoute;
