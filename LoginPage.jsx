import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, User, Lock, ArrowRight, Sparkles, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('STUDENT');
  const [username, setUsername] = useState('22aids01');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'ADMIN') {
      setUsername('admin');
      setPassword('admin123');
    } else if (newRole === 'STUDENT') {
      setUsername('22aids01');
      setPassword('student123');
    } else if (newRole === 'FACULTY') {
      setUsername('prof_smith');
      setPassword('faculty123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password, role);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="glass-card p-4 p-md-5 position-relative overflow-hidden">
            {/* Top Red Glow Line */}
            <div 
              className="position-absolute top-0 start-0 end-0" 
              style={{ height: '4px', background: 'var(--gradient-red-orange)' }} 
            />

            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(255,51,75,0.12)', border: '1px solid var(--border-glow-red)' }}>
                <ShieldCheck size={32} className="text-danger" />
              </div>
              <h2 className="fw-bold text-white m-0">Portal Authentication</h2>
              <p className="text-muted small mt-1">Course Registration &amp; Timetable System</p>
            </div>

            {/* Role Selection Tabs */}
            <div className="d-flex p-1 rounded-3 mb-4" style={{ background: '#141620', border: '1px solid var(--border-color)' }}>
              <button 
                className={`btn flex-fill py-2 small fw-semibold rounded-2 transition-all ${role === 'STUDENT' ? 'btn-orange' : 'text-muted'}`}
                onClick={() => handleRoleChange('STUDENT')}
                type="button"
              >
                STUDENT
              </button>
              <button 
                className={`btn flex-fill py-2 small fw-semibold rounded-2 transition-all ${role === 'FACULTY' ? 'btn-red' : 'text-muted'}`}
                onClick={() => handleRoleChange('FACULTY')}
                type="button"
              >
                FACULTY
              </button>
              <button 
                className={`btn flex-fill py-2 small fw-semibold rounded-2 transition-all ${role === 'ADMIN' ? 'btn-red' : 'text-muted'}`}
                onClick={() => handleRoleChange('ADMIN')}
                type="button"
              >
                ADMIN
              </button>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small border-0 mb-4" style={{ background: 'rgba(255,51,75,0.2)', color: '#FF7084' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  {role === 'ADMIN' ? 'Username' : role === 'STUDENT' ? 'Roll Number / Username' : 'Faculty Code / Username'}
                </label>
                <div className="input-group">
                  <span className="input-group-text form-control-dark border-end-0">
                    <User size={18} className="text-muted" />
                  </span>
                  <input 
                    type="text" 
                    className="form-control form-control-dark border-start-0" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Enter username" 
                    required 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Password</label>
                <div className="input-group">
                  <span className="input-group-text form-control-dark border-end-0">
                    <Lock size={18} className="text-muted" />
                  </span>
                  <input 
                    type="password" 
                    className="form-control form-control-dark border-start-0" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter password" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`btn w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 ${role === 'STUDENT' ? 'btn-orange' : 'btn-red'}`}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : `Login as ${role}`}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Quick Demo Credentials Assistant */}
            <div className="mt-4 pt-3 border-top border-secondary text-center">
              <div className="d-flex align-items-center justify-content-center gap-1 text-muted small mb-2">
                <KeyRound size={14} className="text-warning" />
                <span>Quick Demo Accounts:</span>
              </div>
              <div className="d-flex justify-content-center gap-2 flex-wrap" style={{ fontSize: '0.75rem' }}>
                <span className="badge bg-dark border border-secondary text-white-50 cursor-pointer" onClick={() => handleRoleChange('STUDENT')}>
                  Student: 22aids01 / student123
                </span>
                <span className="badge bg-dark border border-secondary text-white-50 cursor-pointer" onClick={() => handleRoleChange('ADMIN')}>
                  Admin: admin / admin123
                </span>
                <span className="badge bg-dark border border-secondary text-white-50 cursor-pointer" onClick={() => handleRoleChange('FACULTY')}>
                  Faculty: prof_smith / faculty123
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
