import React from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import AuthShell from '../../components/auth/AuthShell';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';

// Serves both /login and /register. Both routes render this same component, so React
// keeps it mounted when switching between them and the photo panel can slide across.
const AuthPage = () => {
  const { pathname } = useLocation();
  const mode = pathname === '/register' ? 'register' : 'login';

  return (
    <MainLayout>
      <AuthShell mode={mode} loginForm={<LoginForm />} registerForm={<RegisterForm />} />
    </MainLayout>
  );
};

export default AuthPage;
