import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthForm from '../../components/AuthForm/AuthForm';

const Auth: React.FC = () => {
  const location = useLocation();
  const mode = location.pathname.includes('register') ? 'register' : 'login';

  return <AuthForm mode={mode} />;
};

export default Auth;
