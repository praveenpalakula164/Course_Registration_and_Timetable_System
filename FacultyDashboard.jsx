import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { UserCheck, BookOpen, Users, Clock, Calendar, DoorOpen } from 'lucide-react';

export default function FacultyDashboard() {
  const { user, profile } = useContext(AuthContext);
  const [assignedSlots, setAssignedSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      API.get(`/timetable?faculty_id=${profile.id}`)
        .then(res => setAssignedSlots(res.data || []))
        .catch(err => console.error("Faculty slots error", err))
        .finally(() => setLoading(false));
    }
  }, [profile]);

  const uniqueCourses = Array.from(new Set(assignedSlots.map(s => s.course_code)));

  return (
    <div className="container py-4">
      {/* Banner */}
      <div className="glass-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div className="badge-red mb-1">FACULTY PROFESSOR PORTAL</div>
            <h2 className="fw-extrabold text-white m-0">{profile?.name || user?.username}</h2>
            <p className="text-muted small m-0">Faculty Code: <span className="text-warning fw-bold">{profile?.faculty_code}</span> · Department: {profile?.department}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-danger text-white">
              <BookOpen size={22} />
            </div>
            <div>
              <div className="display-6 fw-bold text-white">{uniqueCourses.length}</div>
              <div className="text-muted small">Assigned Subjects</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card glass-card-orange p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-warning text-white">
              <Clock size={22} />
            </div>
            <div>
              <div className="display-6 fw-bold text-warning">{assignedSlots.length}</div>
              <div className="text-muted small">Weekly Class Slots</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-danger text-white">
              <DoorOpen size={22} />
            </div>
            <div>
              <div className="display-6 fw-bold text-white">Active</div>
              <div className="text-muted small">2nd Year · Sem 1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="glass-card glass-card-orange p-4">
        <h4 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
          <Calendar size={20} className="text-warning" />
          <span>My Teaching Timetable Schedule</span>
        </h4>

        {assignedSlots.length === 0 ? (
          <p className="text-muted py-4 text-center">No teaching slots assigned yet for current semester.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time Slot</th>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Branch</th>
                  <th>Classroom</th>
                </tr>
              </thead>
              <tbody>
                {assignedSlots.map((s) => (
                  <tr key={s.id}>
                    <td className="fw-bold text-warning">{s.day}</td>
                    <td className="fw-semibold text-white">{s.start_time} - {s.end_time}</td>
                    <td className="fw-bold text-danger">{s.course_code}</td>
                    <td className="fw-semibold text-white">{s.course_name}</td>
                    <td><span className="badge-orange">{s.branch_code}</span></td>
                    <td>{s.room_number} ({s.building})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
