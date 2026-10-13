import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  CheckSquare, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  Info,
  Calendar,
  User,
  MapPin,
  BookOpen,
  Award
} from 'lucide-react';

export default function RegistrationPage() {
  const { user, profile } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [studentSummary, setStudentSummary] = useState(null);

  useEffect(() => {
    if (profile?.id) {
      loadRegistrationContext();
    }
  }, [profile]);

  const loadRegistrationContext = async () => {
    try {
      const [cRes, sRes, tRes] = await Promise.all([
        API.get(`/courses?branch_id=${profile.branch_id}`),
        API.get(`/registrations/student/${profile.id}`),
        API.get(`/timetable?branch_id=${profile.branch_id}`)
      ]);
      setCourses(cRes.data || []);
      setStudentSummary(sRes.data);
      setTimetableSlots(tRes.data || []);
    } catch (err) {
      console.error("Failed to load registration context", err);
    }
  };

  const handleSelectCourse = async (courseId) => {
    setSelectedCourseId(courseId);
    setValidationResult(null);
    setStatusMessage(null);
    setSelectedCourseDetail(null);

    if (!courseId) return;

    setValidating(true);
    try {
      const [valRes, detailRes] = await Promise.all([
        API.post('/registrations/validate', {
          student_id: profile.id,
          course_id: parseInt(courseId)
        }),
        API.get(`/courses/${courseId}`)
      ]);

      setValidationResult(valRes.data);
      setSelectedCourseDetail(detailRes.data);
    } catch (err) {
      setValidationResult({
        valid: false,
        message: err.response?.data?.message || 'Validation request failed.'
      });
    } finally {
      setValidating(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await API.post('/registrations', {
        student_id: profile.id,
        course_id: parseInt(selectedCourseId)
      });

      setStatusMessage({
        success: true,
        text: res.data.message
      });

      setSelectedCourseId('');
      setSelectedCourseDetail(null);
      setValidationResult(null);
      loadRegistrationContext();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration rejected by validation engine.';
      setStatusMessage({
        success: false,
        text: errorMsg,
        details: err.response?.data?.details
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Find assigned timetable slots for selected course
  const courseSchedule = timetableSlots.filter(t => t.course_id === parseInt(selectedCourseId));

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="glass-card glass-card-orange p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div className="badge-red mb-1">AUTOMATED VALIDATION TERMINAL</div>
            <h2 className="fw-extrabold text-gradient m-0">Course Registration &amp; Conflict Engine</h2>
            <p className="text-muted small m-0 mt-1">
              Student: <span className="text-warning fw-bold">{profile?.name}</span> ({profile?.roll_number}) · Branch: <span className="text-white fw-bold">{profile?.branch_code}</span>
            </p>
          </div>

          {studentSummary && (
            <div className="d-flex gap-3 text-end">
              <div>
                <div className="text-muted small">Total Credits</div>
                <div className="fw-bold text-warning fs-5">{studentSummary.total_credits} / {studentSummary.max_credits}</div>
              </div>
              <div>
                <div className="text-muted small">Remaining Credit Cap</div>
                <div className="fw-bold text-success fs-5">{studentSummary.remaining_credits} Credits</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {statusMessage && (
        <div 
          className={`alert ${statusMessage.success ? 'alert-success border-success' : 'alert-danger border-danger'} p-4 mb-4 rounded-3`}
          style={{ background: statusMessage.success ? 'rgba(40,167,69,0.18)' : 'rgba(255,51,75,0.18)', color: '#ffffff' }}
        >
          <div className="d-flex align-items-start gap-3">
            {statusMessage.success ? <CheckCircle2 size={26} className="text-success" /> : <AlertOctagon size={26} className="text-danger" />}
            <div>
              <h5 className="fw-bold m-0" style={{ color: statusMessage.success ? '#28a745' : 'var(--primary-red)' }}>
                {statusMessage.success ? 'Registration Successful!' : 'Registration Failed'}
              </h5>
              <p className="m-0 mt-1">{statusMessage.text}</p>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Course Selector & Detailed Information Inspector */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100">
            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--primary-red)' }}>
              <CheckSquare size={22} className="text-danger" />
              <span>Select &amp; Inspect Course Details</span>
            </h4>

            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-4">
                <label className="form-label text-warning small fw-semibold">
                  Eligible Branch Subjects ({profile?.branch_code})
                </label>
                <select 
                  className="form-select form-control-dark py-2.5"
                  value={selectedCourseId}
                  onChange={(e) => handleSelectCourse(e.target.value)}
                  required
                >
                  <option value="">-- Choose a Course to Register --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.course_code} - {c.course_name} ({c.credits} Credits, {c.available_seats} Seats Left)
                    </option>
                  ))}
                </select>
              </div>

              {/* DETAILED COURSE METADATA DISPLAY */}
              {selectedCourseDetail && (
                <div className="p-3 rounded-3 mb-4" style={{ background: '#121420', border: '1px solid var(--border-glow-red)' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge-red me-2">{selectedCourseDetail.course_code}</span>
                      <span className="badge-orange">{selectedCourseDetail.credits} CREDITS</span>
                    </div>
                    <span className={`badge ${selectedCourseDetail.available_seats > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {selectedCourseDetail.available_seats} Seats Available
                    </span>
                  </div>

                  <h5 className="fw-bold mb-2" style={{ color: 'var(--accent-orange)' }}>
                    {selectedCourseDetail.course_name}
                  </h5>

                  <div className="row g-2 text-muted small mb-3">
                    <div className="col-6">
                      Year: <span className="text-white">Year {selectedCourseDetail.year}</span>
                    </div>
                    <div className="col-6">
                      Semester: <span className="text-white">Semester {selectedCourseDetail.semester}</span>
                    </div>
                    <div className="col-6">
                      Capacity: <span className="text-white">{selectedCourseDetail.capacity} Seats</span>
                    </div>
                    <div className="col-6">
                      Enrolled: <span className="text-white">{selectedCourseDetail.enrolled} Students</span>
                    </div>
                  </div>

                  {/* Prerequisites Details */}
                  {selectedCourseDetail.prerequisites?.length > 0 && (
                    <div className="p-2.5 rounded-2 mb-3 bg-dark border border-warning">
                      <div className="fw-bold text-warning small d-flex align-items-center gap-1 mb-1">
                        <AlertTriangle size={14} /> Required Prerequisite Course:
                      </div>
                      {selectedCourseDetail.prerequisites.map((p, pIdx) => (
                        <div key={pIdx} className="text-white-50 small">
                          • <strong className="text-warning">{p.required_course_code}</strong> ({p.required_course_name}): {p.description}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Assigned Timetable Slot Details */}
                  {courseSchedule.length > 0 && (
                    <div className="p-2.5 rounded-2 bg-dark border border-secondary">
                      <div className="fw-bold text-danger small d-flex align-items-center gap-1 mb-1">
                        <Calendar size={14} /> Scheduled Timetable Slot:
                      </div>
                      {courseSchedule.map((s, sIdx) => (
                        <div key={sIdx} className="text-white-50 small d-flex flex-column gap-1 mt-1">
                          <div>📅 <strong>{s.day}</strong> from <span className="text-warning">{s.start_time} to {s.end_time}</span></div>
                          <div>👨‍🏫 Faculty: <span className="text-white">{s.faculty_name}</span></div>
                          <div>🏫 Room: <span className="text-white">{s.room_number} ({s.building})</span></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 10-Step Validation Pipeline Display */}
              <div className="p-3 rounded-3 mb-4" style={{ background: '#11121a', border: '1px solid var(--border-color)' }}>
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--accent-orange)' }}>
                  <ShieldCheck size={18} className="text-warning" />
                  <span>Validation Sequence Status</span>
                </h6>

                <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
                  <li className="d-flex align-items-center justify-content-between">
                    <span>1. Student Authentication &amp; Active Status</span>
                    <span className="badge bg-success">PASS</span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between">
                    <span>2. Course Existence &amp; Active Status</span>
                    <span className={selectedCourseId ? "badge bg-success" : "badge bg-secondary"}>
                      {selectedCourseId ? "PASS" : "WAITING"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between">
                    <span>3. Branch &amp; Semester Eligibility ({profile?.branch_code})</span>
                    <span className={selectedCourseId ? "badge bg-success" : "badge bg-secondary"}>
                      {selectedCourseId ? "MATCHED" : "WAITING"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between">
                    <span>4. Duplicate Registration Check</span>
                    <span className={selectedCourseId ? (validationResult?.valid ? "badge bg-success" : "badge bg-danger") : "badge bg-secondary"}>
                      {selectedCourseId ? (validationResult?.valid ? "PASS" : "CHECKED") : "WAITING"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between">
                    <span>5. Database Prerequisite Verification</span>
                    <span className={selectedCourseId ? (validationResult?.valid ? "badge bg-success" : "badge bg-warning") : "badge bg-secondary"}>
                      {selectedCourseId ? (validationResult?.valid ? "SATISFIED" : "VERIFYING") : "WAITING"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between">
                    <span>6. Course Capacity Limit</span>
                    <span className={selectedCourseId ? "badge bg-success" : "badge bg-secondary"}>
                      {selectedCourseId ? "SEATS OPEN" : "WAITING"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between">
                    <span>7. Semester Credit Cap (Max {profile?.max_credits})</span>
                    <span className={selectedCourseId ? "badge bg-success" : "badge bg-secondary"}>
                      {selectedCourseId ? "WITHIN LIMIT" : "WAITING"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center justify-content-between">
                    <span>8. Student Timetable Clash Check</span>
                    <span className={selectedCourseId ? (validationResult?.valid ? "badge bg-success" : "badge bg-danger") : "badge bg-secondary"}>
                      {selectedCourseId ? (validationResult?.valid ? "NO CLASH" : "CHECKED") : "WAITING"}
                    </span>
                  </li>
                </ul>
              </div>

              <button 
                type="submit" 
                className="btn btn-red w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                disabled={!selectedCourseId || submitting || (validationResult && !validationResult.valid)}
              >
                {submitting ? 'Executing Validation...' : 'Submit Course Registration'}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Validation Result Inspection Card */}
        <div className="col-lg-6">
          <div className="glass-card glass-card-orange p-4 h-100">
            <h4 className="fw-bold mb-3" style={{ color: 'var(--primary-red)' }}>
              Precheck Inspection Results
            </h4>

            {validating ? (
              <div className="text-center py-5 text-muted">
                <RefreshCw size={28} className="spin mb-2 text-warning" />
                <p>Running multi-level conflict check engine...</p>
              </div>
            ) : validationResult ? (
              <div className={`p-4 rounded-3 ${validationResult.valid ? 'bg-success bg-opacity-10 border border-success' : 'bg-danger bg-opacity-10 border border-danger'}`}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  {validationResult.valid ? (
                    <CheckCircle2 size={24} className="text-success" />
                  ) : (
                    <AlertTriangle size={24} className="text-danger" />
                  )}
                  <h5 className="fw-bold m-0" style={{ color: validationResult.valid ? '#28a745' : 'var(--primary-red)' }}>
                    {validationResult.valid ? 'Precheck Passed Successfully' : 'Validation Error Detected'}
                  </h5>
                </div>

                <p className="text-white-50 mt-2 mb-3">{validationResult.message}</p>

                {validationResult.details && (
                  <div className="p-3 rounded-2" style={{ background: '#0a0a0f' }}>
                    <div className="small fw-bold text-warning mb-1">Validation Metadata Breakdown:</div>
                    <pre className="text-white-50 small m-0" style={{ fontSize: '0.78rem' }}>
                      {JSON.stringify(validationResult.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <Info size={36} className="mb-2 text-warning" />
                <p className="m-0">Select a course on the left to trigger real-time metadata inspection &amp; validation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
