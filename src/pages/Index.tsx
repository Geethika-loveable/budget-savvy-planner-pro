
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const user = localStorage.getItem('user');
  
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      window.location.href = '/dashboard';
    } else {
      // If not logged in, redirect to login
      window.location.href = '/login';
    }
  }, [user]);

  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
