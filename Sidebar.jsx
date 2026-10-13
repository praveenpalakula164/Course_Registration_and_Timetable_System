import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  FileText, 
  Presentation, 
  LogOut, 
  User, 
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, profile, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75 d-lg-none" 
          style={{ zIndex: 1040 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside 
        className={`sidebar-container d-flex flex-column justify-content-between p-3 position-fixed top-0 start-0 h-100 transition-all ${mobileOpen ? 'show' : ''}`}
        style={{
          width: '270px',
          background: '#090a0f',
          borderRight: '1px solid var(--border-color)',
          zIndex: 1050
        }}
      >
        <div>
          {/* Top Brand Logo */}
          <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary">
            <Link className="d-flex align-items-center gap-2 text-white text-decoration-none" to="/">
              <div className="d-flex align-items-center justify-content-center p-2 rounded-3 text-white" style={{ background: 'var(--gradient-red-orange)' }}>
                <GraduationCap size={22} />
              </div>
              <div>
                <div className="fw-bold fs-6 lh-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  <span style={{ color: 'var(--primary-red)' }}>ACADEMIC</span> PORTAL
                </div>
                <div className="text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.06em', marginTop: '3px' }}>
                  2ND YEAR · 1ST SEMESTER
                </div>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button className="btn text-white p-1 d-lg-none" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* User Session Quick Badge */}
          {user && (
            <div className="p-2.5 rounded-3 mb-3 d-flex align-items-center gap-2" style={{ background: '#12141d', border: '1px solid var(--border-color)' }}>
              <div className="p-2 rounded-circle bg-danger bg-opacity-20 text-danger">
                <ShieldCheck size={18} />
              </div>
              <div className="overflow-hidden">
                <div className="fw-bold text-white small text-truncate">{profile?.name || user.username}</div>
                <div className="d-flex align-items-center gap-1">
                  <span className="badge-red" style={{ fontSize: '0.65rem' }}>{user.role}</span>
                  {profile?.branch_code && (
                    <span className="badge-orange" style={{ fontSize: '0.65rem' }}>{profile.branch_code}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="text-muted small fw-bold px-2 mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            MAIN MENU
          </div>

          <nav className="nav flex-column gap-1">
            <Link 
              className={`nav-link-sidebar d-flex align-items-center justify-content-between p-2.5 rounded-3 text-decoration-none ${isActive('/dashboard') ? 'active' : ''}`}
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
            >
              <div className="d-flex align-items-center gap-2.5">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </div>
              <ChevronRight size={14} className="opacity-50" />
            </Link>

            <Link 
              className={`nav-link-sidebar d-flex align-items-center justify-content-between p-2.5 rounded-3 text-decoration-none ${isActive('/courses') ? 'active' : ''}`}
              to="/courses"
              onClick={() => setMobileOpen(false)}
            >
              <div className="d-flex align-items-center gap-2.5">
                <BookOpen size={18} />
                <span>Courses</span>
              </div>
              <ChevronRight size={14} className="opacity-50" />
            </Link>

            <Link 
              className={`nav-link-sidebar d-flex align-items-center justify-content-between p-2.5 rounded-3 text-decoration-none ${isActive('/registration') ? 'active' : ''}`}
              to="/registration"
              onClick={() => setMobileOpen(false)}
            >
              <div className="d-flex align-items-center gap-2.5">
                <CheckSquare size={18} />
                <span>Registration</span>
              </div>
              <ChevronRight size={14} className="opacity-50" />
            </Link>

            <Link 
              className={`nav-link-sidebar d-flex align-items-center justify-content-between p-2.5 rounded-3 text-decoration-none ${isActive('/timetable') ? 'active' : ''}`}
              to="/timetable"
              onClick={() => setMobileOpen(false)}
            >
              <div className="d-flex align-items-center gap-2.5">
                <Calendar size={18} />
                <span>Timetable</span>
              </div>
              <ChevronRight size={14} className="opacity-50" />
            </Link>

            <Link 
              className={`nav-link-sidebar d-flex align-items-center justify-content-between p-2.5 rounded-3 text-decoration-none ${isActive('/reports') ? 'active' : ''}`}
              to="/reports"
              onClick={() => setMobileOpen(false)}
            >
              <div className="d-flex align-items-center gap-2.5">
                <FileText size={18} />
                <span>Reports</span>
              </div>
              <ChevronRight size={14} className="opacity-50" />
            </Link>

            {/* MANDATORY: PROJECT OVERVIEW MUST BE THE LAST NAVIGATION ITEM */}
            <div className="my-2 border-top border-secondary opacity-50" />
            
            <Link 
              className={`nav-link-sidebar nav-link-sidebar-highlight d-flex align-items-center justify-content-between p-2.5 rounded-3 text-decoration-none ${isActive('/project-overview') ? 'active' : ''}`}
              to="/project-overview"
              onClick={() => setMobileOpen(false)}
            >
              <div className="d-flex align-items-center gap-2.5">
                <Presentation size={18} />
                <span>Project Overview</span>
              </div>
              <ChevronRight size={14} />
            </Link>
          </nav>
        </div>

        {/* Footer User / Auth Action */}
        <div className="pt-3 border-top border-secondary">
          {user ? (
            <button 
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 small fw-semibold"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-red w-100 d-flex align-items-center justify-content-center gap-2 py-2 small fw-semibold"
              onClick={() => setMobileOpen(false)}
            >
              <User size={16} />
              <span>Portal Login</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
