import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, MapPin, User, AlertTriangle } from 'lucide-react';

export default function TimetablePage() {
  const { profile } = useContext(AuthContext);

  const [timetable, setTimetable] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(profile?.branch_id || 1);
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { name: 'Period 1', start: '09:00', end: '10:30' },
    { name: 'Period 2', start: '10:30', end: '12:00' },
    { name: 'Lunch Break', start: '12:00', end: '13:30', isLunch: true },
    { name: 'Period 3', start: '13:30', end: '15:00' },
    { name: 'Period 4', start: '15:00', end: '16:30' }
  ];

  useEffect(() => {
    fetchTimetableData();
  }, [selectedBranch]);

  const fetchTimetableData = async () => {
    setLoading(true);
    try {
      const [bRes, tRes] = await Promise.all([
        API.get('/branches'),
        API.get(`/timetable?branch_id=${selectedBranch}`)
      ]);
      setBranches(bRes.data);
      setTimetable(tRes.data || []);
    } catch (err) {
      console.error("Failed to load timetable data", err);
    } finally {
      setLoading(false);
    }
  };

  const findSlot = (day, startTime) => {
    return timetable.find(
      t => t.day.toLowerCase() === day.toLowerCase() && t.start_time === startTime
    );
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-extrabold text-white m-0">Master Academic Timetable</h2>
          <p className="text-muted small m-0">Conflict-Free Schedule Grid · 2nd Year 1st Semester</p>
        </div>

        <div className="d-flex gap-2">
          {branches.map(b => (
            <button 
              key={b.id}
              className={`btn btn-sm ${selectedBranch === b.id ? 'btn-red' : 'btn-outline-glow'}`}
              onClick={() => setSelectedBranch(b.id)}
            >
              {b.branch_code}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Schedule Grid */}
      <div className="glass-card p-4 overflow-auto">
        <table className="custom-table text-center" style={{ minWidth: '850px' }}>
          <thead>
            <tr>
              <th style={{ width: '120px' }}>Day / Time</th>
              {periods.map((p, idx) => (
                <th key={idx} style={{ background: p.isLunch ? 'rgba(255,122,0,0.1)' : 'rgba(15,16,21,0.9)' }}>
                  <div>{p.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>{p.start} - {p.end}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="fw-bold text-warning align-middle">{day}</td>
                {periods.map((period, pIdx) => {
                  if (period.isLunch) {
                    return (
                      <td key={pIdx} className="align-middle text-muted small" style={{ background: 'rgba(255,122,0,0.05)' }}>
                        <span className="badge-orange">LUNCH BREAK</span>
                      </td>
                    );
                  }

                  const slot = findSlot(day, period.start);

                  return (
                    <td key={pIdx} className="align-middle p-2">
                      {slot ? (
                        <div className="p-2.5 rounded-3 text-start glass-card" style={{ background: 'rgba(255,51,75,0.12)', borderLeft: '3px solid var(--primary-red)' }}>
                          <div className="fw-bold text-danger small">{slot.course_code}</div>
                          <div className="text-white fw-semibold" style={{ fontSize: '0.8rem' }}>{slot.course_name}</div>
                          <div className="text-muted mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                            <User size={12} className="text-warning" />
                            <span>{slot.faculty_name}</span>
                          </div>
                          <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                            <MapPin size={12} className="text-danger" />
                            <span>{slot.room_number}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted small py-3" style={{ fontSize: '0.75rem', opacity: 0.4 }}>
                          Free Slot
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
