import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './login/login';
import Register from './register/register';
import Home from './home/home';
import Profile from './profile/profile';
import EditProfile from './editProfile/editProfile';
import ChangePassword from './changePassword/changePassword';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import NotFound from './components/NotFound';

function App() {
  return (
    <Routes>
      {/* Trasy publiczne */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Trasy prywatne */}
      <Route 
        path="/home" 
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/edit-profile" 
        element={
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/change-password" 
        element={
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        } 
      />

      {/* Domyślne przekierowanie */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Obsługa nieznanych tras */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
