import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Building2, 
  DoorOpen, 
  CheckSquare, 
  Calendar, 
  Settings, 
  Plus, 
  Trash2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('courses');

  // Dashboard Stats
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    branches: 0,
    classrooms: 0,
    registrations: 0,
    slots: 0
  });

  // Data Collections
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    course_code: '',
    course_name: '',
    credits: 4,
    capacity: 60,
    year: 2,
    semester: 1,
    branch_ids: [1]
  });

  const [showPrereqModal, setShowPrereqModal] = useState(false);
  const [newPrereq, setNewPrereq] = useState({
    course_id: '',
    required_course_id: '',
    description: ''
  });

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    course_id: '',
    branch_id: '',
    faculty_id: '',
    classroom_id: '',
    day: 'Monday',
    start_time: '09:00',
    end_time: '10:30'
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [
        bRes, cRes, pRes, rRes, tRes, sRes, fRes, regRes
      ] = await Promise.all([
        API.get('/branches'),
        API.get('/courses'),
        API.get('/prerequisites'),
        API.get('/classrooms'),
        API.get('/timetable'),
        API.get('/students'),
        API.get('/faculty'),
        API.get('/reports/registrations')
      ]);

      setBranches(bRes.data);
      setCourses(cRes.data);
      setPrerequisites(pRes.data);
      setClassrooms(rRes.data);
      setTimetable(tRes.data);
      setStudents(sRes.data);
      setFaculty(fRes.data);
      setRegistrations(regRes.data.list || []);

      setStats({
        students: sRes.data.length,
        faculty: fRes.data.length,
        courses: cRes.data.length,
        branches: bRes.data.length,
        classrooms: rRes.data.length,
        registrations: regRes.data.total_registrations || 0,
        slots: tRes.data.length
      });
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await API.post('/courses', newCourse);
      setMessage({ text: `Course ${newCourse.course_code} created successfully!`, type: 'success' });
      setShowCourseModal(false);
      fetchAdminData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to create course.', type: 'danger' });
    }
  };

  const handleCreatePrerequisite = async (e) => {
    e.preventDefault();
    try {
      await API.post('/prerequisites', newPrereq);
      setMessage({ text: 'Prerequisite created successfully!', type: 'success' });
      setShowPrereqModal(false);
      fetchAdminData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to create prerequisite.', type: 'danger' });
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await API.post('/timetable', newSlot);
      setMessage({ text: 'Timetable slot created successfully!', type: 'success' });
      setShowSlotModal(false);
      fetchAdminData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Timetable slot creation failed.', type: 'danger' });
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/${courseId}`);
      setMessage({ text: 'Course deleted successfully.', type: 'success' });
      fetchAdminData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Delete failed.', type: 'danger' });
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await API.delete(`/timetable/${slotId}`);
      setMessage({ text: 'Timetable slot removed.', type: 'success' });
      fetchAdminData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Delete failed.', type: 'danger' });
    }
  };

  return (
    <div className="container py-4">
      {/* Admin Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-extrabold text-white m-0">Admin Control Tower</h2>
          <p className="text-muted small m-0">System Management · 2nd Year 1st Semester Configuration</p>
        </div>
        <button className="btn btn-outline-glow d-flex align-items-center gap-2" onClick={fetchAdminData}>
          <RefreshCw size={16} />
          <span>Refresh Data</span>
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show py-2 px-3 small border-0 mb-4`} style={{ background: message.type === 'success' ? 'rgba(40,167,69,0.2)' : 'rgba(255,51,75,0.2)' }}>
          {message.text}
          <button type="button" className="btn-close btn-close-white py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* 8 Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-danger bg-opacity-20 text-danger">
              <Users size={22} />
            </div>
            <div>
              <div className="text-white fw-bold fs-5">{stats.students}</div>
              <div className="text-muted small">Total Students</div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card glass-card-orange p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-warning bg-opacity-20 text-warning">
              <UserCheck size={22} />
            </div>
            <div>
              <div className="text-white fw-bold fs-5">{stats.faculty}</div>
              <div className="text-muted small">Faculty Members</div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-danger bg-opacity-20 text-danger">
              <BookOpen size={22} />
            </div>
            <div>
              <div className="text-white fw-bold fs-5">{stats.courses}</div>
              <div className="text-muted small">Active Courses</div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card glass-card-orange p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-warning bg-opacity-20 text-warning">
              <Building2 size={22} />
            </div>
            <div>
              <div className="text-white fw-bold fs-5">{stats.branches}</div>
              <div className="text-muted small">Academic Branches</div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-danger bg-opacity-20 text-danger">
              <DoorOpen size={22} />
            </div>
            <div>
              <div className="text-white fw-bold fs-5">{stats.classrooms}</div>
              <div className="text-muted small">Classrooms</div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card glass-card-orange p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-warning bg-opacity-20 text-warning">
              <CheckSquare size={22} />
            </div>
            <div>
              <div className="text-white fw-bold fs-5">{stats.registrations}</div>
              <div className="text-muted small">Registrations</div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-danger bg-opacity-20 text-danger">
              <Calendar size={22} />
            </div>
            <div>
              <div className="text-white fw-bold fs-5">{stats.slots}</div>
              <div className="text-muted small">Timetable Slots</div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card glass-card-orange p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-3 bg-warning bg-opacity-20 text-warning">
              <Settings size={22} />
            </div>
            <div>
              <div className="text-white fw-bold fs-5">Active</div>
              <div className="text-muted small">Year 2 · Sem 1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Menu Tabs */}
      <div className="d-flex border-bottom border-secondary mb-4 gap-2 overflow-auto pb-2">
        <button className={`btn btn-sm ${activeTab === 'courses' ? 'btn-red' : 'btn-outline-glow'}`} onClick={() => setActiveTab('courses')}>
          Manage Courses ({courses.length})
        </button>
        <button className={`btn btn-sm ${activeTab === 'prerequisites' ? 'btn-orange' : 'btn-outline-glow'}`} onClick={() => setActiveTab('prerequisites')}>
          Prerequisites ({prerequisites.length})
        </button>
        <button className={`btn btn-sm ${activeTab === 'timetable' ? 'btn-red' : 'btn-outline-glow'}`} onClick={() => setActiveTab('timetable')}>
          Timetable ({timetable.length})
        </button>
        <button className={`btn btn-sm ${activeTab === 'students' ? 'btn-orange' : 'btn-outline-glow'}`} onClick={() => setActiveTab('students')}>
          Students ({students.length})
        </button>
        <button className={`btn btn-sm ${activeTab === 'faculty' ? 'btn-red' : 'btn-outline-glow'}`} onClick={() => setActiveTab('faculty')}>
          Faculty ({faculty.length})
        </button>
        <button className={`btn btn-sm ${activeTab === 'classrooms' ? 'btn-orange' : 'btn-outline-glow'}`} onClick={() => setActiveTab('classrooms')}>
          Classrooms ({classrooms.length})
        </button>
      </div>

      {/* TAB CONTENT */}
      {/* 1. COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="glass-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold text-white m-0">Course Catalog Management</h4>
            <button className="btn btn-red btn-sm d-flex align-items-center gap-1" onClick={() => setShowCourseModal(true)}>
              <Plus size={16} /> Create New Course
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Capacity</th>
                  <th>Enrolled</th>
                  <th>Available</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-bold text-danger">{c.course_code}</td>
                    <td className="fw-semibold text-white">{c.course_name}</td>
                    <td>{c.credits} Credits</td>
                    <td>{c.capacity}</td>
                    <td>{c.enrolled}</td>
                    <td>
                      <span className={`badge ${c.available_seats > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {c.available_seats} Seats
                      </span>
                    </td>
                    <td><span className="badge-red">{c.status}</span></td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm p-1" onClick={() => handleDeleteCourse(c.id)}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PREREQUISITES TAB */}
      {activeTab === 'prerequisites' && (
        <div className="glass-card glass-card-orange p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold text-white m-0">Database-Driven Prerequisite Rules</h4>
            <button className="btn btn-orange btn-sm d-flex align-items-center gap-1" onClick={() => setShowPrereqModal(true)}>
              <Plus size={16} /> Add Prerequisite Rule
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Target Course</th>
                  <th>Required Prerequisite</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {prerequisites.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-bold text-white">{p.course_code} ({p.course_name})</td>
                    <td className="fw-bold text-warning">{p.required_course_code} ({p.required_course_name})</td>
                    <td className="text-muted small">{p.description}</td>
                    <td><span className="badge-orange">{p.status}</span></td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm p-1" onClick={() => API.delete(`/prerequisites/${p.id}`).then(fetchAdminData)}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TIMETABLE TAB */}
      {activeTab === 'timetable' && (
        <div className="glass-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold text-white m-0">Timetable Schedule Entries</h4>
            <button className="btn btn-red btn-sm d-flex align-items-center gap-1" onClick={() => setShowSlotModal(true)}>
              <Plus size={16} /> Schedule Class Slot
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time Slot</th>
                  <th>Course</th>
                  <th>Branch</th>
                  <th>Faculty</th>
                  <th>Classroom</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((t) => (
                  <tr key={t.id}>
                    <td className="fw-bold text-warning">{t.day}</td>
                    <td className="fw-semibold text-white">{t.start_time} - {t.end_time}</td>
                    <td className="fw-bold text-danger">{t.course_code}</td>
                    <td><span className="badge-orange">{t.branch_code}</span></td>
                    <td>{t.faculty_name}</td>
                    <td>{t.room_number} ({t.building})</td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm p-1" onClick={() => handleDeleteSlot(t.id)}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. STUDENTS TAB */}
      {activeTab === 'students' && (
        <div className="glass-card glass-card-orange p-4">
          <h4 className="fw-bold text-white mb-3">Enrolled Student Directory</h4>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>Year/Sem</th>
                  <th>Max Credits</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="fw-bold text-danger">{s.roll_number}</td>
                    <td className="fw-semibold text-white">{s.name}</td>
                    <td>{s.email}</td>
                    <td><span className="badge-orange">{s.branch_code}</span></td>
                    <td>Year {s.year} - Sem {s.semester}</td>
                    <td>{s.max_credits} Credits</td>
                    <td><span className="badge-red">{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. FACULTY TAB */}
      {activeTab === 'faculty' && (
        <div className="glass-card p-4">
          <h4 className="fw-bold text-white mb-3">Faculty Directory</h4>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Faculty Code</th>
                  <th>Faculty Name</th>
                  <th>Email</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((f) => (
                  <tr key={f.id}>
                    <td className="fw-bold text-warning">{f.faculty_code}</td>
                    <td className="fw-semibold text-white">{f.name}</td>
                    <td>{f.email}</td>
                    <td>{f.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. CLASSROOMS TAB */}
      {activeTab === 'classrooms' && (
        <div className="glass-card glass-card-orange p-4">
          <h4 className="fw-bold text-white mb-3">Classroom Inventory</h4>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Building</th>
                  <th>Seating Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-bold text-danger">{r.room_number}</td>
                    <td className="fw-semibold text-white">{r.building}</td>
                    <td>{r.capacity} Seats</td>
                    <td><span className="badge bg-success">{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE COURSE */}
      {showCourseModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-dark p-4">
              <h5 className="fw-bold text-white mb-3">Create New Course</h5>
              <form onSubmit={handleCreateCourse}>
                <div className="mb-3">
                  <label className="form-label small text-muted">Course Code</label>
                  <input type="text" className="form-control form-control-dark" value={newCourse.course_code} onChange={(e) => setNewCourse({ ...newCourse, course_code: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Course Name</label>
                  <input type="text" className="form-control form-control-dark" value={newCourse.course_name} onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })} required />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small text-muted">Credits</label>
                    <input type="number" className="form-control form-control-dark" value={newCourse.credits} onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-muted">Capacity</label>
                    <input type="number" className="form-control form-control-dark" value={newCourse.capacity} onChange={(e) => setNewCourse({ ...newCourse, capacity: parseInt(e.target.value) })} required />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-glow btn-sm" onClick={() => setShowCourseModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-red btn-sm">Save Course</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE PREREQUISITE */}
      {showPrereqModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-dark p-4">
              <h5 className="fw-bold text-white mb-3">Add Prerequisite Constraint</h5>
              <form onSubmit={handleCreatePrerequisite}>
                <div className="mb-3">
                  <label className="form-label small text-muted">Target Course</label>
                  <select className="form-select form-control-dark" value={newPrereq.course_id} onChange={(e) => setNewPrereq({ ...newPrereq, course_id: e.target.value })} required>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Required Prerequisite Course</label>
                  <select className="form-select form-control-dark" value={newPrereq.required_course_id} onChange={(e) => setNewPrereq({ ...newPrereq, required_course_id: e.target.value })} required>
                    <option value="">Select Required Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Description / Reason</label>
                  <input type="text" className="form-control form-control-dark" value={newPrereq.description} onChange={(e) => setNewPrereq({ ...newPrereq, description: e.target.value })} />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-glow btn-sm" onClick={() => setShowPrereqModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-orange btn-sm">Add Rule</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE TIMETABLE SLOT */}
      {showSlotModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-dark p-4">
              <h5 className="fw-bold text-white mb-3">Schedule Timetable Class Slot</h5>
              <form onSubmit={handleCreateSlot}>
                <div className="mb-3">
                  <label className="form-label small text-muted">Course</label>
                  <select className="form-select form-control-dark" value={newSlot.course_id} onChange={(e) => setNewSlot({ ...newSlot, course_id: e.target.value })} required>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Branch</label>
                  <select className="form-select form-control-dark" value={newSlot.branch_id} onChange={(e) => setNewSlot({ ...newSlot, branch_id: e.target.value })} required>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.branch_code} - {b.branch_name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Faculty</label>
                  <select className="form-select form-control-dark" value={newSlot.faculty_id} onChange={(e) => setNewSlot({ ...newSlot, faculty_id: e.target.value })} required>
                    <option value="">Select Faculty</option>
                    {faculty.map(f => <option key={f.id} value={f.id}>{f.name} ({f.department})</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Classroom</label>
                  <select className="form-select form-control-dark" value={newSlot.classroom_id} onChange={(e) => setNewSlot({ ...newSlot, classroom_id: e.target.value })} required>
                    <option value="">Select Classroom</option>
                    {classrooms.map(r => <option key={r.id} value={r.id}>{r.room_number} ({r.building})</option>)}
                  </select>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <label className="form-label small text-muted">Day</label>
                    <select className="form-select form-control-dark" value={newSlot.day} onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                  </div>
                  <div className="col-4">
                    <label className="form-label small text-muted">Start Time</label>
                    <input type="text" className="form-control form-control-dark" value={newSlot.start_time} onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })} placeholder="09:00" required />
                  </div>
                  <div className="col-4">
                    <label className="form-label small text-muted">End Time</label>
                    <input type="text" className="form-control form-control-dark" value={newSlot.end_time} onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })} placeholder="10:30" required />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-glow btn-sm" onClick={() => setShowSlotModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-red btn-sm">Save Slot</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
