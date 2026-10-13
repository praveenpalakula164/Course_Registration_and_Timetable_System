import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  CreditCard, 
  Clock, 
  AlertCircle,
  PlusCircle,
  Trash2
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, profile } = useContext(AuthContext);

  const [studentData, setStudentData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (profile?.id) {
      fetchStudentDashboard();
    }
  }, [profile]);

  const fetchStudentDashboard = async () => {
    setLoading(true);
    try {
      const [regRes, ttRes] = await Promise.all([
        API.get(`/registrations/student/${profile.id}`),
        API.get(`/timetable?branch_id=${profile.branch_id}`)
      ]);

      setStudentData(regRes.data.student);
      setRegistrations(regRes.data.registrations || []);
      setTimetable(ttRes.data || []);
    } catch (err) {
      console.error("Failed to load student dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDropCourse = async (regId, courseName) => {
    if (!window.confirm(`Are you sure you want to drop course: ${courseName}?`)) return;
    try {
      await API.delete(`/registrations/${regId}`);
      setMessage({ text: `Successfully dropped ${courseName}. Seats restored.`, type: 'success' });
      fetchStudentDashboard();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Drop request failed.', type: 'danger' });
    }
  };

  // Get Today's Day Name (e.g. Monday, Tuesday)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()] || 'Monday';
  const todaySlots = timetable.filter(t => t.day.toLowerCase() === todayName.toLowerCase() || t.day === 'Monday');

  const totalCredits = registrations.reduce((acc, r) => acc + (r.credits || 0), 0);
  const maxCredits = profile?.max_credits || 24;
  const remainingCredits = maxCredits - totalCredits;

  return (
    <div className="container py-4">
      {/* Student Banner */}
      <div className="glass-card glass-card-orange p-4 mb-4 position-relative overflow-hidden">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge-orange">{profile?.branch_code} BRANCH</span>
              <span className="badge-red">YEAR {profile?.year} · SEMESTER {profile?.semester}</span>
            </div>
            <h2 className="fw-extrabold text-white m-0">Welcome back, {profile?.name || user?.username}!</h2>
            <p className="text-muted small m-0">Roll Number: <span className="text-warning fw-bold">{profile?.roll_number}</span> · {profile?.email}</p>
          </div>

          <div className="d-flex gap-2">
            <Link to="/registration" className="btn btn-red d-flex align-items-center gap-2">
              <PlusCircle size={18} />
              <span>Register New Course</span>
            </Link>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show py-2 px-3 small border-0 mb-4`} style={{ background: message.type === 'success' ? 'rgba(40,167,69,0.2)' : 'rgba(255,51,75,0.2)' }}>
          {message.text}
          <button type="button" className="btn-close btn-close-white py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* Credit & Registration Status Gauges */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="glass-card p-3 text-center">
            <div className="text-muted small mb-1">Registered Courses</div>
            <div className="display-6 fw-bold text-white">{registrations.length}</div>
            <div className="text-danger small">Active Enrolled</div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card glass-card-orange p-3 text-center">
            <div className="text-muted small mb-1">Total Enrolled Credits</div>
            <div className="display-6 fw-bold text-warning">{totalCredits}</div>
            <div className="text-muted small">Current Semester</div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card p-3 text-center">
            <div className="text-muted small mb-1">Remaining Credit Cap</div>
            <div className="display-6 fw-bold text-success">{remainingCredits}</div>
            <div className="text-muted small">Max Cap: {maxCredits}</div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card glass-card-orange p-3 text-center">
            <div className="text-muted small mb-1">Registration Status</div>
            <div className="fs-5 fw-bold text-success mt-2">ACTIVE</div>
            <div className="badge-orange mt-1">Verified</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: My Registered Courses */}
        <div className="col-lg-7">
          <div className="glass-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-white m-0 d-flex align-items-center gap-2">
                <BookOpen size={20} className="text-danger" />
                <span>My Registered Courses</span>
              </h4>
              <Link to="/courses" className="small text-warning text-decoration-none fw-semibold">
                Browse All Branch Courses &rarr;
              </Link>
            </div>

            {registrations.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <AlertCircle size={36} className="mb-2 text-warning" />
                <p className="m-0">No courses registered yet for 2nd Year 1st Semester.</p>
                <Link to="/registration" className="btn btn-red btn-sm mt-3">Start Course Registration</Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Credits</th>
                      <th>Registration Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((r) => (
                      <tr key={r.id}>
                        <td className="fw-bold text-danger">{r.course_code}</td>
                        <td className="fw-semibold text-white">{r.course_name}</td>
                        <td><span className="badge-orange">{r.credits} Credits</span></td>
                        <td className="text-muted small">{r.registration_date}</td>
                        <td>
                          <button className="btn btn-outline-danger btn-sm p-1" title="Drop Course" onClick={() => handleDropCourse(r.id, r.course_name)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Today's Timetable */}
        <div className="col-lg-5">
          <div className="glass-card glass-card-orange p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-white m-0 d-flex align-items-center gap-2">
                <Clock size={20} className="text-warning" />
                <span>Today's Timetable</span>
              </h4>
              <span className="badge-orange">{todayName} Schedule</span>
            </div>

            {todaySlots.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <p className="m-0">No scheduled classes for today.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {todaySlots.map((slot) => (
                  <div key={slot.id} className="p-3 rounded-3" style={{ background: '#141622', borderLeft: '4px solid var(--primary-red)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-danger">{slot.course_code} - {slot.course_name}</span>
                      <span className="badge-orange">{slot.start_time} - {slot.end_time}</span>
                    </div>
                    <div className="text-muted small">
                      Faculty: <span className="text-white">{slot.faculty_name}</span> · Room: <span className="text-warning">{slot.room_number} ({slot.building})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-top border-secondary text-center">
              <Link to="/timetable" className="btn btn-outline-glow btn-sm w-100">
                View Full Weekly Timetable Grid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
