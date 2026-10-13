import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Users, 
  Building, 
  ArrowRight, 
  Sparkles, 
  Database, 
  Lock, 
  Cpu, 
  BarChart3, 
  Zap 
} from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="landing-page overflow-hidden">
      {/* Hero Section */}
      <section className="position-relative py-5 my-4">
        {/* Glow Effects */}
        <div 
          className="position-absolute rounded-circle"
          style={{
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,51,75,0.18) 0%, rgba(255,122,0,0.08) 50%, rgba(0,0,0,0) 80%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill glass-card mb-4" style={{ borderColor: 'var(--border-glow-red)' }}>
              <Sparkles size={16} className="text-warning" />
              <span className="small fw-semibold text-white">2nd Year · 1st Semester Academic Management Platform</span>
            </div>

            <h1 className="display-3 fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              COURSE REGISTRATION <br />
              <span className="text-gradient">&amp; TIMETABLE SYSTEM</span>
            </h1>

            <p className="fs-5 text-muted mb-4 max-w-2xl mx-auto">
              "Smart Academic Registration with Conflict-Free Timetables"
            </p>

            <p className="text-white-50 small mb-5 max-w-xl mx-auto">
              Eliminates prerequisite violations, student timetable clashes, faculty double-booking, and classroom scheduling overlaps using real-time algorithmic conflict checking.
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/login" className="btn btn-red btn-lg d-flex align-items-center gap-2 px-4 py-3">
                <span>Access Academic Portal</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/project-overview" className="btn btn-orange btn-lg d-flex align-items-center gap-2 px-4 py-3">
                <span>Explore Project Overview</span>
                <Sparkles size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated Key Statistics */}
      <section className="py-4 my-3">
        <div className="container">
          <motion.div 
            className="row g-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="col-md-3 col-6">
              <motion.div variants={itemVariants} className="glass-card p-4 text-center">
                <div className="text-gradient display-5 fw-bold mb-1">5</div>
                <div className="text-white fw-semibold small">Specialized Branches</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>AIDS · CSM · CSD · CAI · CSC</div>
              </motion.div>
            </div>

            <div className="col-md-3 col-6">
              <motion.div variants={itemVariants} className="glass-card glass-card-orange p-4 text-center">
                <div className="text-warning display-5 fw-bold mb-1">10-Step</div>
                <div className="text-white fw-semibold small">Validation Engine</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Strict Rules Enforcement</div>
              </motion.div>
            </div>

            <div className="col-md-3 col-6">
              <motion.div variants={itemVariants} className="glass-card p-4 text-center">
                <div className="text-danger display-5 fw-bold mb-1">0%</div>
                <div className="text-white fw-semibold small">Timetable Clashes</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Guaranteed Conflict-Free</div>
              </motion.div>
            </div>

            <div className="col-md-3 col-6">
              <motion.div variants={itemVariants} className="glass-card glass-card-orange p-4 text-center">
                <div className="text-gradient display-5 fw-bold mb-1">9</div>
                <div className="text-white fw-semibold small">Analytical Reports</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Real-time Monitoring</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            {/* Problem Statement Card */}
            <div className="col-md-6">
              <motion.div 
                className="glass-card p-4 h-100 border-danger" 
                style={{ background: 'rgba(30, 8, 12, 0.65)' }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-danger text-white rounded-3 p-2">
                    <ShieldAlert size={24} />
                  </div>
                  <h3 className="text-white fw-bold m-0">1. Problem Statement</h3>
                </div>

                <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(0,0,0,0.5)', borderLeft: '4px solid var(--primary-red)' }}>
                  <p className="fst-italic text-white-50 m-0">
                    "A college's registration process allows timetable clashes and prerequisite violations."
                  </p>
                </div>

                <p className="text-muted small mb-3">
                  Traditional registration tools fail to perform real-time verification before saving course choices. This creates major academic issues:
                </p>

                <ul className="text-white-50 small d-flex flex-column gap-2 ps-3 mb-0">
                  <li>Student timetable overlaps between mandatory subjects (e.g. DBMS vs JAVA)</li>
                  <li>Prerequisite course violations (e.g. enrolling in Advanced DBMS without clearing DBMS)</li>
                  <li>Exceeding credit limits or registering for unapproved branches/semesters</li>
                  <li>Classroom and Faculty double-booking during peak lecture hours</li>
                </ul>
              </motion.div>
            </div>

            {/* Solution Card */}
            <div className="col-md-6">
              <motion.div 
                className="glass-card glass-card-orange p-4 h-100"
                style={{ background: 'rgba(25, 15, 8, 0.65)' }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-warning text-dark rounded-3 p-2" style={{ background: 'var(--accent-orange)' }}>
                    <CheckCircle2 size={24} className="text-white" />
                  </div>
                  <h3 className="text-white fw-bold m-0">2. Algorithmic Solution</h3>
                </div>

                <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(0,0,0,0.5)', borderLeft: '4px solid var(--accent-orange)' }}>
                  <p className="fw-semibold text-white m-0">
                    Centralized Automated Pre-Registration Validation Engine
                  </p>
                </div>

                <p className="text-muted small mb-3">
                  Our system evaluates every registration attempt against 10 strict validation rules before committing changes to the MySQL database:
                </p>

                <ul className="text-white-50 small d-flex flex-column gap-2 ps-3 mb-0">
                  <li>Branch-specific course eligibility mapping for 2nd Year 1st Sem</li>
                  <li>Prerequisite verification against student academic history</li>
                  <li>Automated credit cap and available capacity checks</li>
                  <li>Instant student, faculty, and classroom timetable overlap detection</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-5 my-3">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-white mb-2">Role-Based System Architecture</h2>
            <p className="text-muted">Designed specifically for three main college user roles</p>
          </div>

          <div className="row g-4">
            {/* ADMIN */}
            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge-red fs-6">ADMIN ROLE</span>
                  <ShieldAlert className="text-danger" size={24} />
                </div>
                <h4 className="fw-bold text-white mb-3">System Administrator</h4>
                <ul className="text-muted small d-flex flex-column gap-2 ps-3 mb-4">
                  <li>Manage Students &amp; Faculty accounts</li>
                  <li>Manage Branches &amp; Course mappings</li>
                  <li>Configure Prerequisites &amp; Classrooms</li>
                  <li>Build Timetable &amp; Monitor Clashes</li>
                  <li>Generate Academic Audit Reports</li>
                </ul>
                <Link to="/login" className="btn btn-outline-glow w-100 text-center">Login as Admin</Link>
              </div>
            </div>

            {/* STUDENT */}
            <div className="col-md-4">
              <div className="glass-card glass-card-orange p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge-orange fs-6">STUDENT ROLE</span>
                  <BookOpen className="text-warning" size={24} />
                </div>
                <h4 className="fw-bold text-white mb-3">College Student</h4>
                <ul className="text-muted small d-flex flex-column gap-2 ps-3 mb-4">
                  <li>View branch-specific eligible courses</li>
                  <li>Check prerequisites &amp; course capacity</li>
                  <li>Register for courses with live conflict test</li>
                  <li>Track credit consumption &amp; remaining limit</li>
                  <li>View personal daily &amp; weekly timetable</li>
                </ul>
                <Link to="/login" className="btn btn-orange w-100 text-center">Login as Student</Link>
              </div>
            </div>

            {/* FACULTY */}
            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge-red fs-6">FACULTY ROLE</span>
                  <Users className="text-danger" size={24} />
                </div>
                <h4 className="fw-bold text-white mb-3">Faculty Professor</h4>
                <ul className="text-muted small d-flex flex-column gap-2 ps-3 mb-4">
                  <li>View assigned teaching courses</li>
                  <li>Check enrolled student rosters</li>
                  <li>Access personal weekly teaching timetable</li>
                  <li>Monitor classroom allocations &amp; schedule</li>
                  <li>View academic calendar &amp; timings</li>
                </ul>
                <Link to="/login" className="btn btn-outline-glow w-100 text-center">Login as Faculty</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="py-5">
        <div className="container">
          <div className="glass-card p-5 text-center">
            <h2 className="fw-bold text-white mb-2">Modern Technology Stack</h2>
            <p className="text-muted mb-4">Built with industry-standard full-stack frameworks &amp; architectural patterns</p>

            <div className="row g-3 justify-content-center text-start">
              <div className="col-md-3 col-6">
                <div className="p-3 rounded-3" style={{ background: '#13141f', border: '1px solid var(--border-color)' }}>
                  <div className="fw-bold text-danger mb-1">Frontend</div>
                  <div className="text-white small">React.js · Vite</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Bootstrap &amp; Framer Motion</div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-3 rounded-3" style={{ background: '#13141f', border: '1px solid var(--border-color)' }}>
                  <div className="fw-bold text-warning mb-1">Backend</div>
                  <div className="text-white small">Python Flask</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>SQLAlchemy &amp; REST API</div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-3 rounded-3" style={{ background: '#13141f', border: '1px solid var(--border-color)' }}>
                  <div className="fw-bold text-danger mb-1">Database</div>
                  <div className="text-white small">MySQL Relational</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Normalized Schema &amp; PK/FK</div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-3 rounded-3" style={{ background: '#13141f', border: '1px solid var(--border-color)' }}>
                  <div className="fw-bold text-warning mb-1">Security</div>
                  <div className="text-white small">JWT Authentication</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Password Hashing &amp; RBAC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
