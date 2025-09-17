import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Index } from "@/pages/Index";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Login } from "@/pages/Login";
import { Cadastro } from "@/pages/Cadastro";
import { Demo } from "@/pages/Demo";
import { Dashboard } from "@/pages/Dashboard";
import Medicos from "@/pages/Medicos";
import { Agendamentos } from "@/pages/Agendamentos";
import { Consultas } from "@/pages/Consultas";
import { Prontuarios } from "@/pages/Prontuarios";
import { Pagamentos } from "@/pages/Pagamentos";
import { Clinicas } from "@/pages/Clinicas";
import Pacientes from "@/pages/Pacientes";
import DocumentosMedicos from "@/pages/DocumentosMedicos";
import Historico from "@/pages/Historico";
import { Procedimentos } from "@/pages/Procedimentos";
import TesteCamera from "@/pages/TesteCamera";
import { Videochamada } from "@/pages/Videochamada";
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
    <Route path="/demo" element={<Demo />} />
    <Route 
      path="/login" 
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } 
    />
    <Route 
      path="/cadastro" 
      element={
        <PublicRoute>
          <Cadastro />
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
      path="/medicos" 
      element={
        <ProtectedRoute>
          <Medicos />
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
    <Route 
      path="/documentos" 
      element={
        <ProtectedRoute>
          <DocumentosMedicos />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/historico" 
      element={
        <ProtectedRoute>
          <Layout>
            <Historico />
          </Layout>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/procedimentos" 
      element={
        <ProtectedRoute>
          <Layout>
            <Procedimentos />
          </Layout>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/teste-camera" 
      element={
        <ProtectedRoute>
          <TesteCamera />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/video/:consultaId" 
      element={
        <ProtectedRoute>
          <Videochamada />
        </ProtectedRoute>
      } 
    />
    <Route path="/" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Toaster />
      <Sonner />
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;