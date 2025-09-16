import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Agendamentos } from "@/pages/Agendamentos";
import { Consultas } from "@/pages/Consultas";
import { Prontuarios } from "@/pages/Prontuarios";
import { Pagamentos } from "@/pages/Pagamentos";
import { Clinicas } from "@/pages/Clinicas";
import Pacientes from "@/pages/Pacientes";
import NotFound from "@/pages/NotFound";

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para rotas públicas (só acessa se não estiver logado)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route 
      path="/login" 
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } 
    />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/agendamentos" 
      element={
        <ProtectedRoute>
          <Layout>
            <Agendamentos />
          </Layout>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/consultas" 
      element={
        <ProtectedRoute>
          <Layout>
            <Consultas />
          </Layout>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/prontuarios" 
      element={
        <ProtectedRoute>
          <Layout>
            <Prontuarios />
          </Layout>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/pagamentos" 
      element={
        <ProtectedRoute>
          <Layout>
            <Pagamentos />
          </Layout>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/clinicas" 
      element={
        <ProtectedRoute>
          <Layout>
            <Clinicas />
          </Layout>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/pacientes" 
      element={
        <ProtectedRoute>
          <Layout>
            <Pacientes />
          </Layout>
        </ProtectedRoute>
      } 
    />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;