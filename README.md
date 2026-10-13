# COURSE REGISTRATION & TIMETABLE SYSTEM
> **ONE SYSTEM. COMPLETE ACADEMIC REGISTRATION.**  
> *Smart Academic Registration with Conflict-Free Timetables (2nd Year – 1st Semester)*

---

## 🌟 Overview
The **Course Registration & Timetable System** is a modern, high-performance academic management web application built to eliminate timetable clashes, prerequisite violations, credit-limit overflows, and classroom double-booking in college registration processes.

Featuring a **10-Step Automated Validation Engine**, **Role-Based Access Control (Admin, Student, Faculty)**, **9 Real-Time Reports**, and an **Interactive Project Overview Slide Deck**.

---

## 🎨 Theme & Visual Identity
- **Primary Colors**: RED (`#FF334B`), ORANGE (`#FF7A00`), BLACK (`#070709`), WHITE (`#FFFFFF`)
- **Aesthetics**: Sleek Dark Mode, Glassmorphism, Micro-interactions, Glowing Accents

---

## ⚡ Tech Stack
- **Frontend**: React.js, Vite, Bootstrap 5, Framer Motion, Lucide Icons, Axios
- **Backend**: Python, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, PyMySQL
- **Database**: MySQL (with zero-config SQLite dynamic fallback)

---

## 🔑 Default Login Credentials

| Role | Username | Password | Access Rights |
|---|---|---|---|
| **ADMIN** | `admin` | `admin123` | Full system control, course/timetable/prerequisite management, reports |
| **STUDENT (AIDS)** | `22aids01` | `student123` | Register courses, drop courses, view timetable, view credit cap |
| **FACULTY** | `prof_smith` | `faculty123` | View assigned courses, student rosters, teaching timetable |

---

## 🚀 How to Run the Application

### 1. Prerequisites
- Python 3.10+ (with `pip`)
- Node.js 18+ (with `npm`)

### 2. Backend Setup & Startup
```bash
cd backend
py -m pip install -r requirements.txt
py run.py
```
*Backend API will run on `http://127.0.0.1:5005` (automatically creates and seeds database tables).*

### 3. Frontend Setup & Startup
```bash
cd frontend
npm install
npm run dev
```
*Frontend web application will open on `http://localhost:3000`.*

---

## 📂 Project Structure
```
CourseRegistrationTimetableSystem/
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar (Project Overview last nav item), Footer
│   │   ├── context/      # AuthContext
│   │   ├── pages/        # LandingPage, LoginPage, Dashboards, Courses, Registration, Timetable, Reports, ProjectOverview
│   │   ├── services/     # API Axios wrapper
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css     # Red/Orange/Black theme styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── models/       # SQLAlchemy Models
│   │   ├── routes/       # Auth, Academic, Registration, Report APIs
│   │   ├── services/     # 10-Step Validation Engine & Timetable Conflict Service
│   │   └── __init__.py
│   ├── config.py
│   ├── requirements.txt
│   └── run.py
├── database/
│   └── college_registration.sql  # Complete MySQL database schema & seed script
├── docs/
│   └── PROJECT_DOCUMENTATION.md  # 27-Section Academic Documentation
└── README.md
```

---

## 📜 License
© 2026 Academic Project. All rights reserved.
