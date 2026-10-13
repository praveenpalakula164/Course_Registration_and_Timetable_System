import React, { useContext } from 'react';
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
  ShieldCheck 
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top py-2">
      <div className="container-fluid px-4">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold fs-5" to="/">
          <div className="d-flex align-items-center justify-content-center bg-gradient-red text-white rounded-3 p-2" style={{ background: 'var(--gradient-red-orange)' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <span style={{ color: 'var(--primary-red)' }}>ACADEMIC</span>
            <span className="text-white ms-1">REGISTRATION</span>
            <div className="text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', marginTop: '-3px' }}>
              2ND YEAR · 1ST SEMESTER
            </div>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-secondary text-white" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarMain"
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        {/* Main Nav Links */}
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <Link className={`nav-link-custom d-flex align-items-center gap-2 ${isActive('/dashboard') ? 'active' : ''}`} to="/dashboard">
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link-custom d-flex align-items-center gap-2 ${isActive('/courses') ? 'active' : ''}`} to="/courses">
                <BookOpen size={17} />
                <span>Courses</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link-custom d-flex align-items-center gap-2 ${isActive('/registration') ? 'active' : ''}`} to="/registration">
                <CheckSquare size={17} />
                <span>Registration</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link-custom d-flex align-items-center gap-2 ${isActive('/timetable') ? 'active' : ''}`} to="/timetable">
                <Calendar size={17} />
                <span>Timetable</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link-custom d-flex align-items-center gap-2 ${isActive('/reports') ? 'active' : ''}`} to="/reports">
                <FileText size={17} />
                <span>Reports</span>
              </Link>
            </li>

            {/* MANDATORY: PROJECT OVERVIEW MUST BE THE LAST NAVIGATION ITEM */}
            <li className="nav-item">
              <Link className={`nav-link-custom nav-link-highlight d-flex align-items-center gap-2 ${isActive('/project-overview') ? 'active' : ''}`} to="/project-overview">
                <Presentation size={17} />
                <span>Project Overview</span>
              </Link>
            </li>
          </ul>

          {/* User Profile / Auth Action */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-glow d-flex align-items-center gap-2 py-1 px-3 dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <ShieldCheck size={16} style={{ color: 'var(--primary-red)' }} />
                  <span className="small fw-semibold">{user.username.toUpperCase()}</span>
                  <span className="badge-red ms-1">{user.role}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end modal-content-dark p-2 mt-2 shadow-lg" style={{ minWidth: '220px' }}>
                  <li className="px-3 py-2 border-bottom border-secondary mb-2">
                    <div className="fw-bold text-white small">{profile?.name || user.username}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{profile?.email || user.email}</div>
                    {profile?.branch_code && (
                      <div className="badge-orange mt-1 d-inline-block">{profile.branch_code} Branch</div>
                    )}
                  </li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center gap-2 py-2 rounded-2" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-red d-flex align-items-center gap-2">
                <User size={16} />
                <span>Portal Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
