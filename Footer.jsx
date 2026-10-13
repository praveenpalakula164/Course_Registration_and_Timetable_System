import React from 'react';
import { GraduationCap, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto py-5 border-top border-secondary position-relative overflow-hidden" style={{ background: '#050508' }}>
      <div className="container text-center">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
          <div className="bg-gradient-red p-2 rounded-3" style={{ background: 'var(--gradient-red-orange)' }}>
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="fw-bold fs-5 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            <span style={{ color: 'var(--primary-red)' }}>ACADEMIC</span> REGISTRATION & TIMETABLE SYSTEM
          </span>
        </div>

        <h4 className="fw-extrabold text-gradient mb-2" style={{ letterSpacing: '0.05em' }}>
          ONE SYSTEM. COMPLETE ACADEMIC REGISTRATION.
        </h4>

        <p className="text-muted small mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Real-time course validation, zero-clash timetable scheduling, branch-wise prerequisite enforcement, and administrative analytics for 2nd Year – 1st Semester.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap mb-4" style={{ fontSize: '0.8rem' }}>
          <span className="badge-red d-flex align-items-center gap-1">
            <ShieldCheck size={14} /> JWT RBAC Security
          </span>
          <span className="badge-orange d-flex align-items-center gap-1">
            <Cpu size={14} /> Overlap Clash Engine
          </span>
          <span className="badge-red d-flex align-items-center gap-1">
            AIDS · CSM · CSD · CAI · CSC
          </span>
        </div>

        <div className="text-muted border-top border-secondary pt-3" style={{ fontSize: '0.78rem' }}>
          Course Registration & Timetable System · 2nd Year – 1st Semester · © 2026 Academic Project
        </div>
      </div>
    </footer>
  );
}
