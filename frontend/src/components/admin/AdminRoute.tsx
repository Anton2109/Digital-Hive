import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    console.log('AdminRoute: текущий пользователь:', user);
  }, [user]);

  if (!user) {
    console.log('AdminRoute: пользователь не авторизован');
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== 'admin') {
    console.log('AdminRoute: недостаточно прав доступа');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 