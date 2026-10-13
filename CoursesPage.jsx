import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, CheckCircle, AlertCircle, PlusCircle, Sparkles, Filter, Info, Calendar, User, MapPin, X } from 'lucide-react';

export default function CoursesPage() {
  const { user, profile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(profile?.branch_id || '');
  const [loading, setLoading] = useState(true);

  // Selected Course Modal
  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [courseSchedule, setCourseSchedule] = useState([]);

  useEffect(() => {
    fetchCoursesAndBranches();
  }, [selectedBranch]);

  const fetchCoursesAndBranches = async () => {
    setLoading(true);
    try {
      const bRes = await API.get('/branches');
      setBranches(bRes.data);

      const url = selectedBranch ? `/courses?branch_id=${selectedBranch}` : '/courses';
      const cRes = await API.get(url);
      setCourses(cRes.data);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (courseId) => {
    try {
      const [detailRes, ttRes] = await Promise.all([
        API.get(`/courses/${courseId}`),
        API.get(`/timetable`)
      ]);

      setActiveCourseModal(detailRes.data);
      const slots = (ttRes.data || []).filter(t => t.course_id === parseInt(courseId));
      setCourseSchedule(slots);
    } catch (err) {
      console.error("Failed to fetch course details", err);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-extrabold text-white m-0">2nd Year 1st Sem Course Catalog</h2>
          <p className="text-muted small m-0">Branch-Specific Curriculum &amp; Seat Availability</p>
        </div>

        {/* Branch Filter Tabs */}
        <div className="d-flex gap-2 overflow-auto">
          <button 
            className={`btn btn-sm ${!selectedBranch ? 'btn-red' : 'btn-outline-glow'}`}
            onClick={() => setSelectedBranch('')}
          >
            All Branches
          </button>
          {branches.map((b) => (
            <button 
              key={b.id}
              className={`btn btn-sm ${selectedBranch === b.id ? 'btn-orange' : 'btn-outline-glow'}`}
              onClick={() => setSelectedBranch(b.id)}
            >
              {b.branch_code}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">Loading courses...</div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-md-6 col-lg-4" key={course.id}>
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge-red fs-6">{course.course_code}</span>
                    <span className="badge-orange">{course.credits} Credits</span>
                  </div>

                  <h4 className="fw-bold text-white mb-2">{course.course_name}</h4>
                  <p className="text-muted small mb-3">
                    Academic Level: Year {course.year} · Semester {course.semester}
                  </p>

                  <div className="p-3 rounded-3 mb-3" style={{ background: '#13141f', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>Capacity Allocation</span>
                      <span className="text-white fw-bold">{course.enrolled} / {course.capacity}</span>
                    </div>
                    <div className="progress" style={{ height: '6px', background: '#222533' }}>
                      <div 
                        className="progress-bar bg-gradient-red" 
                        style={{ 
                          width: `${(course.enrolled / course.capacity) * 100}%`,
                          background: 'var(--gradient-red-orange)'
                        }} 
                      />
                    </div>
                    <div className="d-flex justify-content-between small text-muted mt-2" style={{ fontSize: '0.75rem' }}>
                      <span>Seats Available:</span>
                      <span className={course.available_seats > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                        {course.available_seats} Seats Remaining
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-glow btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                    onClick={() => handleOpenDetails(course.id)}
                  >
                    <Info size={15} />
                    <span>View Details</span>
                  </button>
                  <Link to="/registration" className="btn btn-red btn-sm flex-fill d-flex align-items-center justify-content-center gap-1">
                    <PlusCircle size={15} />
                    <span>Register</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RICH COURSE DETAILS MODAL */}
      {activeCourseModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-content-dark p-4">
              <div className="d-flex justify-content-between align-items-start border-bottom border-secondary pb-3 mb-3">
                <div>
                  <span className="badge-red me-2">{activeCourseModal.course_code}</span>
                  <span className="badge-orange me-2">{activeCourseModal.credits} CREDITS</span>
                  <span className="badge bg-secondary">Year {activeCourseModal.year} · Sem {activeCourseModal.semester}</span>
                  <h3 className="fw-bold text-white mt-2 mb-0">{activeCourseModal.course_name}</h3>
                </div>
                <button className="btn text-white p-1" onClick={() => setActiveCourseModal(null)}>
                  <X size={24} />
                </button>
              </div>

              <div className="row g-3 mb-4">
                {/* Offered Branches */}
                <div className="col-md-6">
                  <div className="p-3 rounded-3 h-100" style={{ background: '#13141f' }}>
                    <div className="fw-bold text-warning small mb-2">Offered Academic Branches:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {activeCourseModal.branches?.map((b, idx) => (
                        <span key={idx} className="badge-orange">{b.branch_code}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Capacity Gauge */}
                <div className="col-md-6">
                  <div className="p-3 rounded-3 h-100" style={{ background: '#13141f' }}>
                    <div className="fw-bold text-danger small mb-1">Capacity Allocation:</div>
                    <div className="text-white fs-5 fw-bold">{activeCourseModal.enrolled} / {activeCourseModal.capacity} Enrolled</div>
                    <div className="text-success small fw-semibold mt-1">{activeCourseModal.available_seats} Available Seats Left</div>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="mb-4">
                <h6 className="fw-bold text-white mb-2">Prerequisite Requirements:</h6>
                {activeCourseModal.prerequisites?.length === 0 ? (
                  <div className="p-3 rounded-3 text-muted small" style={{ background: '#13141f' }}>
                    No prerequisite subjects required. All eligible branch students may register directly.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {activeCourseModal.prerequisites.map((p, pIdx) => (
                      <div key={pIdx} className="p-3 rounded-3 bg-dark border border-warning">
                        <div className="fw-bold text-warning small">Prerequisite Subject: {p.required_course_code} - {p.required_course_name}</div>
                        <div className="text-white-50 small mt-1">{p.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timetable Schedule */}
              <div className="mb-4">
                <h6 className="fw-bold text-white mb-2">Assigned Timetable Schedule Slots:</h6>
                {courseSchedule.length === 0 ? (
                  <div className="p-3 rounded-3 text-muted small" style={{ background: '#13141f' }}>
                    No lecture slots scheduled for this course yet.
                  </div>
                ) : (
                  <div className="row g-2">
                    {courseSchedule.map((s, sIdx) => (
                      <div key={sIdx} className="col-md-6">
                        <div className="p-3 rounded-3 glass-card">
                          <div className="fw-bold text-danger">{s.day}: {s.start_time} - {s.end_time}</div>
                          <div className="text-muted small mt-1">Faculty: <span className="text-white">{s.faculty_name}</span></div>
                          <div className="text-muted small">Classroom: <span className="text-warning">{s.room_number} ({s.building})</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary">
                <button className="btn btn-outline-glow" onClick={() => setActiveCourseModal(null)}>Close</button>
                <button 
                  className="btn btn-red d-flex align-items-center gap-1"
                  onClick={() => {
                    setActiveCourseModal(null);
                    navigate('/registration');
                  }}
                >
                  <PlusCircle size={16} /> Proceed to Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
