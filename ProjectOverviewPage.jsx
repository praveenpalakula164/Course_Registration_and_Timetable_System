import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  GitBranch, 
  BookOpen, 
  Users, 
  Layers, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Workflow, 
  FileText, 
  Sparkles,
  Rocket
} from 'lucide-react';

export default function ProjectOverviewPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'PROJECT',
      title: '1. PROJECT OVERVIEW',
      subtitle: '2nd Year – 1st Semester Academic System',
      icon: <Presentation className="text-danger" size={32} />,
      content: (
        <div>
          <div className="badge-red mb-3">FINAL ACADEMIC PROJECT PRESENTATION</div>
          <h1 className="display-4 fw-extrabold text-white mb-3">
            COURSE REGISTRATION <br />
            <span className="text-gradient">&amp; TIMETABLE SYSTEM</span>
          </h1>
          <p className="fs-5 text-muted mb-4 max-w-xl">
            "Smart Academic Registration with Conflict-Free Timetables"
          </p>

          <div className="row g-3 mt-3">
            <div className="col-md-6">
              <div className="p-3 rounded-3" style={{ background: '#141620', border: '1px solid var(--border-color)' }}>
                <div className="text-danger fw-bold small">Academic Year</div>
                <div className="text-white fs-4 fw-bold">2nd Year</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 rounded-3" style={{ background: '#141620', border: '1px solid var(--border-color)' }}>
                <div className="text-warning fw-bold small">Academic Semester</div>
                <div className="text-white fs-4 fw-bold">1st Semester</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'PROBLEM',
      title: '2. PROBLEM STATEMENT',
      subtitle: 'Why Traditional Systems Fail',
      icon: <AlertTriangle className="text-danger" size={32} />,
      content: (
        <div>
          <div className="p-4 rounded-3 mb-4" style={{ background: 'rgba(255,51,75,0.15)', borderLeft: '5px solid var(--primary-red)' }}>
            <h3 className="fw-bold text-white mb-2">Problem Statement:</h3>
            <p className="fs-5 text-white-50 m-0 fst-italic">
              "A college's registration process allows timetable clashes and prerequisite violations."
            </p>
          </div>

          <p className="text-muted mb-3">The system addresses and eliminates nine major college registration flaws:</p>
          <div className="row g-2">
            {[
              "Student Timetable Clashes", "Prerequisite Violations", "Duplicate Registrations",
              "Course Capacity Oversubscription", "Semester Credit Limit Violations", "Invalid Branch/Semester Selections",
              "Faculty Schedule Conflicts", "Classroom Double-Booking", "Unverified Manual Registrations"
            ].map((err, idx) => (
              <div key={idx} className="col-md-4">
                <div className="p-2.5 rounded-3 bg-dark border border-danger text-danger small font-monospace">
                  ✖ {err}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'SOLUTION',
      title: '3. ALGORITHMIC SOLUTION',
      subtitle: 'Automated Pre-Registration Validation',
      icon: <CheckCircle2 className="text-success" size={32} />,
      content: (
        <div>
          <h3 className="fw-bold text-white mb-3">Centralized Real-Time Conflict Engine</h3>
          <p className="text-muted mb-4">
            Instead of allowing bad registrations to enter the database and fixing them manually later, our solution validates every attempt in real time.
          </p>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="glass-card p-3 h-100">
                <div className="fw-bold text-warning mb-2">Instant Clash Detection</div>
                <div className="text-muted small">
                  Evaluates time overlap logic: <br />
                  <code className="text-danger">New Start &lt; Existing End AND New End &gt; Existing Start</code>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="glass-card p-3 h-100">
                <div className="fw-bold text-success mb-2">Database Prerequisite Check</div>
                <div className="text-muted small">
                  Queries student grade history to verify passed prerequisite courses prior to registration confirmation.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'BRANCHES',
      title: '4. ACADEMIC BRANCHES',
      subtitle: '5 Specialized Engineering Disciplines',
      icon: <GitBranch className="text-warning" size={32} />,
      content: (
        <div>
          <h3 className="fw-bold text-white mb-3">Branch Configuration (2nd Year 1st Sem)</h3>
          <div className="row g-3">
            {[
              { code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
              { code: 'CSM', name: 'Computer Science & Machine Learning' },
              { code: 'CSD', name: 'Computer Science & Data Science' },
              { code: 'CAI', name: 'Computer Science & Artificial Intelligence' },
              { code: 'CSC', name: 'Computer Science & Cyber Security' }
            ].map((b, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="glass-card glass-card-orange p-3">
                  <div className="fw-bold text-danger fs-5">{b.code}</div>
                  <div className="text-white small">{b.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'SUBJECTS',
      title: '5. BRANCH-WISE SUBJECT MAPPING',
      subtitle: 'Exact Curriculum Allocation',
      icon: <BookOpen className="text-danger" size={32} />,
      content: (
        <div>
          <h3 className="fw-bold text-white mb-3">Exact Branch Subject Distribution</h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Common Core Subjects (4)</th>
                  <th>Branch-Specific Core (1)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold text-danger">AIDS</td>
                  <td>DMGT, UHV, ADS, JAVA</td>
                  <td><span className="badge-orange">DBMS</span></td>
                </tr>
                <tr>
                  <td className="fw-bold text-warning">CSM</td>
                  <td>DMGT, UHV, ADS, JAVA</td>
                  <td><span className="badge-orange">AI</span></td>
                </tr>
                <tr>
                  <td className="fw-bold text-danger">CSD</td>
                  <td>DMGT, UHV, ADS, JAVA</td>
                  <td><span className="badge-orange">IDS</span></td>
                </tr>
                <tr>
                  <td className="fw-bold text-warning">CAI</td>
                  <td>DMGT, UHV, ADS, JAVA</td>
                  <td><span className="badge-orange">AI</span></td>
                </tr>
                <tr>
                  <td className="fw-bold text-danger">CSC</td>
                  <td>DMGT, UHV, ADS, JAVA</td>
                  <td><span className="badge-orange">DLCO</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'USERS',
      title: '6. USER ROLES',
      subtitle: 'Multi-Role Access Control',
      icon: <Users className="text-warning" size={32} />,
      content: (
        <div className="row g-3">
          <div className="col-md-4">
            <div className="glass-card p-4">
              <div className="badge-red mb-2">ADMIN</div>
              <h5 className="fw-bold text-white">System Administrator</h5>
              <div className="text-muted small mt-2">Full control over courses, branches, timetable slots, prerequisites, classrooms, and reports.</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="glass-card glass-card-orange p-4">
              <div className="badge-orange mb-2">STUDENT</div>
              <h5 className="fw-bold text-white">College Student</h5>
              <div className="text-muted small mt-2">Views eligible branch courses, performs conflict-checked registration, drops courses, views timetable.</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="glass-card p-4">
              <div className="badge-red mb-2">FACULTY</div>
              <h5 className="fw-bold text-white">Faculty Member</h5>
              <div className="text-muted small mt-2">Views assigned courses, enrolled student rosters, teaching timetable, and classroom schedules.</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'REGISTRATION',
      title: '7. REGISTRATION ENGINE',
      subtitle: 'Complete Execution Flow',
      icon: <Workflow className="text-danger" size={32} />,
      content: (
        <div>
          <h3 className="fw-bold text-white mb-3">Student Course Registration Lifecycle</h3>
          <div className="p-3 rounded-3 mb-3 text-center" style={{ background: '#121420', border: '1px solid var(--border-glow-red)' }}>
            <div className="font-monospace text-warning small">
              Student Login &rarr; Branch &amp; Sem Identified &rarr; Select Course &rarr; 10-Step Validation Pipeline &rarr; Success / Reject
            </div>
          </div>
          <p className="text-muted small">
            If all checks pass: Registration created, seat count decremented, timetable updated. <br />
            If any check fails: Rejected with clear reason (e.g. "Timetable clash detected between DBMS and JAVA.").
          </p>
        </div>
      )
    },
    {
      id: 'TIMETABLE',
      title: '8. TIMETABLE SCHEDULE',
      subtitle: 'Daily Slot Configuration',
      icon: <Layers className="text-warning" size={32} />,
      content: (
        <div>
          <h3 className="fw-bold text-white mb-3">College Timetable Configuration</h3>
          <div className="row g-2 text-center mb-3">
            <div className="col"><div className="p-2 glass-card"><div className="text-muted small">Period 1</div><div className="fw-bold text-danger">09:00 - 10:30</div></div></div>
            <div className="col"><div className="p-2 glass-card"><div className="text-muted small">Period 2</div><div className="fw-bold text-warning">10:30 - 12:00</div></div></div>
            <div className="col"><div className="p-2 glass-card glass-card-orange"><div className="text-muted small">Lunch</div><div className="fw-bold text-success">12:30 - 01:30</div></div></div>
            <div className="col"><div className="p-2 glass-card"><div className="text-muted small">Period 3</div><div className="fw-bold text-danger">01:30 - 03:00</div></div></div>
            <div className="col"><div className="p-2 glass-card"><div className="text-muted small">Period 4</div><div className="fw-bold text-warning">03:00 - 04:30</div></div></div>
          </div>
          <p className="text-muted small">Timetable timing bounds are completely configurable by the Admin.</p>
        </div>
      )
    },
    {
      id: 'VALIDATION',
      title: '9. VALIDATION PIPELINE',
      subtitle: '10-Stage Sequential Checks',
      icon: <ShieldCheck className="text-success" size={32} />,
      content: (
        <div>
          <h3 className="fw-bold text-white mb-3">Validation Decision Sequence</h3>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {[
              "1. Authentication", "2. Course Exists", "3. Course Active", "4. Branch Match",
              "5. Year/Sem Match", "6. No Duplicate", "7. Prerequisite Met", "8. Seats Open",
              "9. Credit Limit Safe", "10. Zero Timetable Clash"
            ].map((step, idx) => (
              <span key={idx} className="badge bg-dark border border-secondary text-warning p-2 font-monospace">
                {step}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'DATABASE',
      title: '10. DATABASE ARCHITECTURE',
      subtitle: 'Normalized Relational MySQL Schema',
      icon: <Database className="text-danger" size={32} />,
      content: (
        <div>
          <h3 className="fw-bold text-white mb-3">12 Relational Tables</h3>
          <div className="row g-2">
            {['users', 'branches', 'students', 'faculty', 'courses', 'branch_courses', 'prerequisites', 'classrooms', 'timetable', 'registrations', 'grades', 'academic_settings'].map((t, idx) => (
              <div key={idx} className="col-md-3 col-6">
                <div className="p-2 rounded-2 bg-dark border border-secondary text-center text-white small font-monospace">
                  table: {t}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'TECHNOLOGY',
      title: '11. TECHNOLOGY STACK',
      subtitle: 'Full-Stack Architecture',
      icon: <Cpu className="text-warning" size={32} />,
      content: (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="glass-card p-3">
              <div className="fw-bold text-danger mb-1">Frontend</div>
              <div className="text-white small">React.js · Vite · Vanilla CSS · Bootstrap · Framer Motion · Axios</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="glass-card glass-card-orange p-3">
              <div className="fw-bold text-warning mb-1">Backend</div>
              <div className="text-white small">Python Flask · Flask-SQLAlchemy · Flask-JWT-Extended · PyMySQL</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'REPORTS',
      title: '12. ANALYTICS & REPORTS',
      subtitle: '9 Administrative Audit Reports',
      icon: <FileText className="text-danger" size={32} />,
      content: (
        <div className="row g-2">
          {[
            "Student Registration Report", "Branch-wise Registration", "Course Enrollment Report",
            "Course Capacity Report", "Timetable Schedule Report", "Timetable Clash Report",
            "Prerequisite Violation Report", "Faculty Schedule Report", "Classroom Schedule Report"
          ].map((r, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="p-2 rounded-2 glass-card small text-white">
                📊 {r}
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'SECURITY',
      title: '13. SECURITY ARCHITECTURE',
      subtitle: 'Enterprise Security Controls',
      icon: <ShieldCheck className="text-warning" size={32} />,
      content: (
        <ul className="text-muted small d-flex flex-column gap-2 ps-3 mb-0">
          <li>JSON Web Token (JWT) stateless authentication</li>
          <li>PBKDF2 password hashing via Werkzeug</li>
          <li>Role-Based Access Control (RBAC) with HTTP 403 enforcement for admin endpoints</li>
          <li>SQLAlchemy ORM SQL-injection protection</li>
        </ul>
      )
    },
    {
      id: 'FUTURE',
      title: '14. FUTURE ENHANCEMENTS',
      subtitle: 'Platform Roadmap',
      icon: <Rocket className="text-danger" size={32} />,
      content: (
        <div className="row g-2">
          {[
            "Automatic Timetable Generation", "Mobile React Native App", "Email & SMS Notifications",
            "Attendance Integration", "Faculty Workload Optimization", "AI-Assisted Timetable Solver"
          ].map((item, idx) => (
            <div key={idx} className="col-md-6">
              <div className="p-2.5 rounded-3 glass-card small text-warning">
                🚀 {item}
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="container py-4">
      {/* Slide Deck Controls Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <div className="badge-orange mb-1">INTERACTIVE PRESENTATION SLIDE DECK</div>
          <h2 className="fw-extrabold text-white m-0">Project Overview Presentation</h2>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small me-2">Slide {currentSlide + 1} of {slides.length}</span>
          <button className="btn btn-outline-glow btn-sm p-2" onClick={handlePrev} disabled={currentSlide === 0}>
            <ChevronLeft size={20} />
          </button>
          <button className="btn btn-red btn-sm p-2" onClick={handleNext} disabled={currentSlide === slides.length - 1}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress mb-4" style={{ height: '4px', background: '#1c1e2b' }}>
        <div 
          className="progress-bar" 
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            background: 'var(--gradient-red-orange)'
          }} 
        />
      </div>

      {/* Active Slide Display */}
      <div className="position-relative overflow-hidden" style={{ minHeight: '420px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-4 p-md-5 h-100"
          >
            <div className="d-flex align-items-center gap-3 mb-3 border-bottom border-secondary pb-3">
              {slides[currentSlide].icon}
              <div>
                <h3 className="fw-bold text-white m-0">{slides[currentSlide].title}</h3>
                <div className="text-muted small">{slides[currentSlide].subtitle}</div>
              </div>
            </div>

            <div className="py-2">
              {slides[currentSlide].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Thumbnails Nav */}
      <div className="d-flex gap-2 overflow-auto mt-4 pt-2">
        {slides.map((s, idx) => (
          <button 
            key={s.id}
            className={`btn btn-sm ${currentSlide === idx ? 'btn-red' : 'btn-outline-glow'}`}
            onClick={() => setCurrentSlide(idx)}
            style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
          >
            {s.id}
          </button>
        ))}
      </div>

      {/* Section 33 Final Summary Footer Banner */}
      <div className="glass-card glass-card-orange p-4 text-center mt-5">
        <h2 className="fw-extrabold text-gradient mb-1" style={{ letterSpacing: '0.05em' }}>
          ONE SYSTEM. COMPLETE ACADEMIC REGISTRATION.
        </h2>
        <h5 className="text-white fw-bold m-0">Course Registration &amp; Timetable System</h5>
        <div className="text-muted small mt-1">2nd Year – 1st Semester · © 2026 Academic Project</div>
      </div>
    </div>
  );
}
