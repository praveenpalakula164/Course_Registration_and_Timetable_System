import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  FileText, 
  BarChart3, 
  PieChart, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  BookOpen, 
  Calendar,
  Building 
} from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('registrations');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let endpoint = '/reports/registrations';
      if (reportType === 'branch-wise') endpoint = '/reports/branch-wise';
      else if (reportType === 'course-enrollment') endpoint = '/reports/course-enrollment';
      else if (reportType === 'capacity') endpoint = '/reports/capacity';
      else if (reportType === 'timetable') endpoint = '/reports/timetable';
      else if (reportType === 'clashes') endpoint = '/reports/clashes';
      else if (reportType === 'prerequisites') endpoint = '/reports/prerequisites';
      else if (reportType === 'faculty-schedule') endpoint = '/reports/faculty-schedule';
      else if (reportType === 'classroom-schedule') endpoint = '/reports/classroom-schedule';

      const res = await API.get(endpoint);
      setReportData(res.data);
    } catch (err) {
      console.error("Failed to load report data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-extrabold text-white m-0">Academic Intelligence &amp; Reports</h2>
          <p className="text-muted small m-0">Real-time System Audit Analytics · 9 Core Reports</p>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="d-flex gap-2 overflow-auto pb-2 mb-4">
        <button className={`btn btn-sm ${reportType === 'registrations' ? 'btn-red' : 'btn-outline-glow'}`} onClick={() => setReportType('registrations')}>
          Student Registrations
        </button>
        <button className={`btn btn-sm ${reportType === 'branch-wise' ? 'btn-orange' : 'btn-outline-glow'}`} onClick={() => setReportType('branch-wise')}>
          Branch-wise Report
        </button>
        <button className={`btn btn-sm ${reportType === 'course-enrollment' ? 'btn-red' : 'btn-outline-glow'}`} onClick={() => setReportType('course-enrollment')}>
          Course Enrollment
        </button>
        <button className={`btn btn-sm ${reportType === 'capacity' ? 'btn-orange' : 'btn-outline-glow'}`} onClick={() => setReportType('capacity')}>
          Capacity Status
        </button>
        <button className={`btn btn-sm ${reportType === 'timetable' ? 'btn-red' : 'btn-outline-glow'}`} onClick={() => setReportType('timetable')}>
          Timetable Grid
        </button>
        <button className={`btn btn-sm ${reportType === 'clashes' ? 'btn-orange' : 'btn-outline-glow'}`} onClick={() => setReportType('clashes')}>
          Clash Risk Analysis
        </button>
        <button className={`btn btn-sm ${reportType === 'prerequisites' ? 'btn-red' : 'btn-outline-glow'}`} onClick={() => setReportType('prerequisites')}>
          Prerequisites
        </button>
        <button className={`btn btn-sm ${reportType === 'faculty-schedule' ? 'btn-orange' : 'btn-outline-glow'}`} onClick={() => setReportType('faculty-schedule')}>
          Faculty Schedule
        </button>
        <button className={`btn btn-sm ${reportType === 'classroom-schedule' ? 'btn-red' : 'btn-outline-glow'}`} onClick={() => setReportType('classroom-schedule')}>
          Classroom Schedule
        </button>
      </div>

      {/* REPORT DISPLAY AREA */}
      <div className="glass-card p-4">
        {loading ? (
          <div className="text-center py-5 text-muted">Generating report data...</div>
        ) : reportData ? (
          <div>
            {/* 1. REGISTRATIONS REPORT */}
            {reportType === 'registrations' && (
              <div>
                <h4 className="fw-bold text-white mb-3">Student Registration Summary</h4>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="p-3 rounded-3" style={{ background: '#141620' }}>
                      <div className="text-muted small">Total Registrations</div>
                      <div className="display-6 fw-bold text-warning">{reportData.total_registrations}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded-3" style={{ background: '#141620' }}>
                      <div className="text-muted small">Active Enrolled</div>
                      <div className="display-6 fw-bold text-success">{reportData.active_registrations}</div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.list?.map((r) => (
                        <tr key={r.id}>
                          <td className="fw-bold text-white">{r.student_name}</td>
                          <td className="text-danger">{r.roll_number}</td>
                          <td className="fw-bold text-warning">{r.course_code}</td>
                          <td>{r.course_name}</td>
                          <td className="text-muted small">{r.registration_date}</td>
                          <td><span className="badge-red">{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. BRANCH-WISE REPORT */}
            {reportType === 'branch-wise' && Array.isArray(reportData) && (
              <div>
                <h4 className="fw-bold text-white mb-3">Branch-wise Registration Breakdown</h4>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Branch Code</th>
                        <th>Branch Name</th>
                        <th>Total Students</th>
                        <th>Mapped Courses</th>
                        <th>Total Registrations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((b, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold text-danger">{b.branch_code}</td>
                          <td className="fw-semibold text-white">{b.branch_name}</td>
                          <td>{b.total_students} Students</td>
                          <td>{b.total_mapped_courses} Courses</td>
                          <td><span className="badge-orange">{b.total_registrations} Registrations</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. COURSE ENROLLMENT REPORT */}
            {reportType === 'course-enrollment' && Array.isArray(reportData) && (
              <div>
                <h4 className="fw-bold text-white mb-3">Course Seat Occupancy Statistics</h4>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Credits</th>
                        <th>Capacity</th>
                        <th>Enrolled</th>
                        <th>Available Seats</th>
                        <th>Occupancy Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((c, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold text-danger">{c.course_code}</td>
                          <td className="fw-semibold text-white">{c.course_name}</td>
                          <td>{c.credits} Credits</td>
                          <td>{c.capacity}</td>
                          <td>{c.enrolled}</td>
                          <td><span className="badge bg-success">{c.available_seats} Seats</span></td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold text-warning">{c.occupancy_percentage}%</span>
                              <div className="progress flex-fill" style={{ height: '6px', minWidth: '80px', background: '#222533' }}>
                                <div className="progress-bar bg-warning" style={{ width: `${c.occupancy_percentage}%` }} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. CLASHES REPORT */}
            {reportType === 'clashes' && (
              <div>
                <h4 className="fw-bold text-white mb-3">Timetable Overlap &amp; Clash Risk Audit</h4>
                <div className="alert alert-dark border border-secondary mb-4 p-3 text-white">
                  <span className="fw-bold text-danger">Total Detected Clashes: </span>
                  <span className="fs-5 text-warning fw-bold ms-2">{reportData.clash_count}</span>
                </div>

                {reportData.clashes?.length === 0 ? (
                  <div className="text-center py-4 text-success fw-semibold">
                    <CheckCircle className="d-block mx-auto mb-2" size={32} />
                    Zero timetable clashes detected! System schedule is 100% conflict-free.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {reportData.clashes?.map((clash, idx) => (
                      <div key={idx} className="p-3 rounded-3 border border-danger bg-danger bg-opacity-10">
                        <div className="fw-bold text-danger mb-1">{clash.type}: {clash.description}</div>
                        <div className="small text-white-50">
                          Slot 1: {clash.slot1?.course_code} ({clash.slot1?.day} {clash.slot1?.start_time}-{clash.slot1?.end_time}) <br />
                          Slot 2: {clash.slot2?.course_code} ({clash.slot2?.day} {clash.slot2?.start_time}-{clash.slot2?.end_time})
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DEFAULT RAW VIEW FOR OTHER REPORTS */}
            {['capacity', 'timetable', 'prerequisites', 'faculty-schedule', 'classroom-schedule'].includes(reportType) && (
              <div>
                <h4 className="fw-bold text-white mb-3">{reportType.toUpperCase().replace('-', ' ')} REPORT</h4>
                <pre className="p-3 rounded-3 text-warning small" style={{ background: '#0a0a0e', overflowX: 'auto' }}>
                  {JSON.stringify(reportData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-5 text-muted">Select a report tab above to display analytics.</div>
        )}
      </div>
    </div>
  );
}
