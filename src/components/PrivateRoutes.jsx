import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';

const PrivateRoutes = () => {
  const location = useLocation();
  const { auth } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      // Redirect to the login page
      navigate('/login');
      setTimeout(() => {
        alert('Enter valid credentials to access the next page');
        // Display an alert when redirected back to the login page
      }, 1);
    }
  }, [auth, navigate]);

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
