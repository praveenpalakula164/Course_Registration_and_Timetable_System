import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import CoursesPage from './pages/CoursesPage';
import RegistrationPage from './pages/RegistrationPage';
import TimetablePage from './pages/TimetablePage';
import ReportsPage from './pages/ReportsPage';
import ProjectOverviewPage from './pages/ProjectOverviewPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center py-5 text-muted">Authenticating portal session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Role-Aware Dashboard Router
const DashboardDispatcher = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'ADMIN') return <AdminDashboard />;
  if (user.role === 'STUDENT') return <StudentDashboard />;
  if (user.role === 'FACULTY') return <FacultyDashboard />;

  return <Navigate to="/login" replace />;
};

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100 bg-black text-white">
      {/* Left Sidebar Toolbar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area Offset to the Right of Left Sidebar */}
      <div className="main-content-layout flex-fill d-flex flex-column">
        <HeaderBar setMobileOpen={setMobileOpen} />
        <main className="flex-fill">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/project-overview" element={<ProjectOverviewPage />} />

            {/* Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardDispatcher />
                </ProtectedRoute>
              } 
            />

            {/* Academic Portal Routes */}
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/timetable" element={<TimetablePage />} />
            
            <Route 
              path="/registration" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                  <RegistrationPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'FACULTY', 'STUDENT']}>
                  <ReportsPage />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
