import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import PropertyForm from './PropertyForm';

const AdminRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          path=""
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="imoveis/novo"
          element={
            <ProtectedRoute>
              <PropertyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="imoveis/:id/editar"
          element={
            <ProtectedRoute>
              <PropertyForm />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/gestao" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AdminRoutes;
