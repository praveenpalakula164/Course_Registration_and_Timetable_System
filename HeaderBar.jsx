import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, User, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function HeaderBar({ setMobileOpen }) {
  const { user, profile } = useContext(AuthContext);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard Tower';
      case '/courses': return 'Course Catalog & Curriculum';
      case '/registration': return 'Registration & Conflict Engine';
      case '/timetable': return 'Master Timetable Schedule';
      case '/reports': return 'Academic Intelligence Reports';
      case '/project-overview': return 'Project Overview Presentation';
      case '/login': return 'Portal Login';
      default: return 'Academic Management Platform';
    }
  };

  return (
    <header className="py-3 px-4 border-bottom border-secondary d-flex align-items-center justify-content-between sticky-top" style={{ background: 'rgba(7,7,9,0.95)', backdropFilter: 'blur(16px)', zIndex: 1030 }}>
      <div className="d-flex align-items-center gap-3">
        {/* Mobile Toggle */}
        <button className="btn text-white p-1 d-lg-none" onClick={() => setMobileOpen(true)}>
          <Menu size={22} />
        </button>

        <div>
          <h5 className="fw-bold text-white m-0 d-flex align-items-center gap-2">
            <span>{getPageTitle()}</span>
          </h5>
          <div className="text-muted" style={{ fontSize: '0.72rem' }}>
            2nd Year · 1st Semester Academic Configuration
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {user ? (
          <div className="d-flex align-items-center gap-2">
            <div className="text-end d-none d-sm-block">
              <div className="fw-bold text-white small">{profile?.name || user.username}</div>
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>{profile?.email || user.email}</div>
            </div>
            <div className="p-2 rounded-circle bg-danger text-white">
              <User size={18} />
            </div>
          </div>
        ) : (
          <Link to="/login" className="btn btn-red btn-sm d-flex align-items-center gap-1">
            <User size={16} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
