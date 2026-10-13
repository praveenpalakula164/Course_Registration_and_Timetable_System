# PROJECT DOCUMENTATION
## COURSE REGISTRATION & TIMETABLE SYSTEM
### Academic Year: 2nd Year | Semester: 1st Semester

---

## 1. Title
**COURSE REGISTRATION & TIMETABLE SYSTEM**
*Tagline: ONE SYSTEM. COMPLETE ACADEMIC REGISTRATION.*

## 2. Abstract
The Course Registration & Timetable System is a modern, high-performance academic management platform built to automate college course registration, eliminate student timetable overlaps, prevent prerequisite violations, enforce credit-limit caps, and optimize classroom and faculty schedule allocations. Designed specifically for 2nd Year 1st Semester academic configurations across 5 engineering branches (AIDS, CSM, CSD, CAI, CSC), the system features a 10-stage automated pre-registration validation engine backed by a normalized MySQL database and Python Flask REST APIs.

## 3. Introduction
In higher education institutions, course registration is a critical academic operation. Traditional manual or legacy CRUD registration portals allow students to enroll in conflicting time slots or attempt advanced courses without satisfying prerequisite prerequisites. This project introduces a centralized, real-time validation architecture that guarantees zero-clash scheduling and strict prerequisite enforcement.

## 4. Problem Statement
*"A college's registration process allows timetable clashes and prerequisite violations."*

Specific vulnerabilities prevented:
- Timetable clashes between mandatory courses (e.g. DBMS vs JAVA)
- Prerequisite violations (enrolling in Advanced DBMS without clearing DBMS)
- Duplicate registrations for the same subject
- Capacity oversubscription beyond physical classroom limits
- Credit-limit cap breaches (exceeding 24 credits per semester)
- Branch / Semester mismatches
- Faculty double-booking
- Classroom double-booking

## 5. Existing System
- Manual paper-based or basic unvalidated CRUD web forms.
- Post-registration manual audit by department heads to catch clashes.
- High risk of human error, delayed schedule publication, and student frustration.

## 6. Proposed System
- Real-time pre-registration validation pipeline.
- Instant 10-step checks prior to committing database entries.
- Automated faculty, student, and classroom timetable overlap detection.
- Role-based access control (Admin, Student, Faculty).
- Interactive presentation slide deck and comprehensive reporting suite.

## 7. Objectives
- Validate every registration attempt against 10 strict academic constraints.
- Prevent 100% of student, faculty, and classroom timetable overlaps.
- Provide branch-specific course filtering (AIDS, CSM, CSD, CAI, CSC).
- Render responsive, high-aesthetic dark mode user interface with RED, ORANGE, BLACK, and WHITE visual identity.

## 8. Scope
Covering 2nd Year 1st Semester curriculum across 5 specialized computer science and AI branches. Scalable to support multi-institution deployments.

## 9. Functional Requirements
- **FR-1 Auth**: JWT-based login with role enforcement (Admin, Student, Faculty).
- **FR-2 Course Catalog**: Branch-mapped course catalog with seat gauges and prerequisites.
- **FR-3 Validation Engine**: Real-time 10-step pre-registration check API (`/api/registrations/validate`).
- **FR-4 Timetable Grid**: 5-day schedule grid with overlap prevention algorithm.
- **FR-5 Reporting**: 9 administrative reports (Registration, Branch-wise, Enrollment, Capacity, Timetable, Clashes, Prerequisites, Faculty Schedule, Classroom Schedule).

## 10. Non-Functional Requirements
- **NFR-1 Security**: Passwords hashed using PBKDF2; JWT stateless auth; RBAC protection.
- **NFR-2 Performance**: Validation response time < 50ms.
- **NFR-3 Responsiveness**: Mobile, tablet, and desktop responsive without horizontal overflow.
- **NFR-4 Visual Identity**: Premium dark mode styling using RED (#FF334B), ORANGE (#FF7A00), BLACK (#070709), and WHITE (#FFFFFF).

## 11. Technology Stack
- **Frontend**: React.js, Vite, Bootstrap 5, Framer Motion, Lucide Icons, Axios.
- **Backend**: Python 3.14, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, PyMySQL.
- **Database**: MySQL Relational Database (with SQLite dynamic fallback).

## 12. System Architecture
```
React Frontend (Vite, Port 3000)
       ↓  Axios / REST API
Flask Backend (Port 5005)
       ↓  10-Step Business Logic Validation
Flask-SQLAlchemy ORM
       ↓  Relational Queries
MySQL Database (college_registration)
```

## 13. ER Diagram
Entities: `users`, `branches`, `students`, `faculty`, `courses`, `branch_courses`, `prerequisites`, `classrooms`, `timetable`, `registrations`, `grades`, `academic_settings`.

## 14. Database Design
- `branches`: `id (PK)`, `branch_code`, `branch_name`
- `students`: `id (PK)`, `user_id (FK)`, `roll_number (UQ)`, `name`, `email`, `branch_id (FK)`, `year`, `semester`, `max_credits`, `status`
- `faculty`: `id (PK)`, `user_id (FK)`, `faculty_code (UQ)`, `name`, `email`, `department`
- `courses`: `id (PK)`, `course_code (UQ)`, `course_name`, `credits`, `capacity`, `year`, `semester`, `status`
- `branch_courses`: `id (PK)`, `branch_id (FK)`, `course_id (FK)`, `semester`
- `prerequisites`: `id (PK)`, `course_id (FK)`, `required_course_id (FK)`, `description`
- `classrooms`: `id (PK)`, `room_number (UQ)`, `building`, `capacity`, `status`
- `timetable`: `id (PK)`, `course_id (FK)`, `branch_id (FK)`, `faculty_id (FK)`, `classroom_id (FK)`, `day`, `start_time`, `end_time`
- `registrations`: `id (PK)`, `student_id (FK)`, `course_id (FK)`, `registration_date`, `status`

## 15. Modules
1. **Authentication & Authorization Module**
2. **Admin Control Tower Module**
3. **Student Portal Module**
4. **Faculty Portal Module**
5. **Registration Validation Engine Module**
6. **Timetable Clash Detection Module**
7. **Prerequisite Enforcement Module**
8. **Reports & Analytics Module**
9. **Project Overview Presentation Deck Module**

## 16. Registration Algorithm
```python
def validate_registration(student, course):
    if not student.active: return Reject("Student account inactive")
    if not course.active: return Reject("Course inactive")
    if course not in student.branch_courses: return Reject("Branch mismatch")
    if student.is_already_registered(course): return Reject("Duplicate registration")
    if not student.has_cleared_prerequisites(course): return Reject("Prerequisite missing")
    if course.enrolled >= course.capacity: return Reject("Course full")
    if student.current_credits + course.credits > student.max_credits: return Reject("Credit limit exceeded")
    if student.has_timetable_overlap(course): return Reject("Timetable clash detected")
    return Accept("Registration permitted")
```

## 17. Timetable Algorithm
College schedule bounds: 09:00 AM – 04:30 PM (Configurable by Admin). Lunch: 12:30 PM – 01:30 PM.

## 18. Clash Detection
Overlap formula:
`(New_Start < Existing_End) AND (New_End > Existing_Start)`
Evaluated across Student schedule, Faculty schedule, and Classroom schedule.

## 19. Prerequisite Validation
Queries the `prerequisites` database table. Validates whether the student has completed grade records or prior registrations for the required prerequisite course.

## 20. Screenshots
Included in application presentation deck.

## 21. Testing
- Test 1: Successful course registration & seat decrement (PASSED)
- Test 2: Prerequisite missing rejection - ADBMS without DBMS (PASSED)
- Test 3: Duplicate course registration rejection (PASSED)
- Test 4: Timetable clash rejection for overlapping slots (PASSED)
- Test 5: Credit cap rejection when exceeding 24 credits (PASSED)
- Test 6: Faculty schedule conflict rejection (PASSED)
- Test 7: Classroom double-booking rejection (PASSED)
- Test 8: HTTP 403 Forbidden for unauthorized student accessing Admin APIs (PASSED)

## 22. Results
Zero timetable clashes and zero prerequisite violations achieved across all test scenarios.

## 23. Advantages
- Real-time precheck validation eliminates post-registration errors.
- Highly intuitive UI with glassmorphism dark theme.
- Interactive slide presentation for academic reviews.

## 24. Limitations
- Current build configured for 2nd Year 1st Semester (easily expandable).

## 25. Future Enhancements
- AI-assisted timetable solver.
- Attendance system integration.
- Mobile React Native application.

## 26. Conclusion
The Course Registration & Timetable System solves college timetable clashes and prerequisite violations through automated validation logic and modern web technologies.

## 27. References
- Flask Documentation: https://flask.palletsprojects.com/
- React Documentation: https://react.dev/
- MySQL Reference Manual: https://dev.mysql.com/doc/
