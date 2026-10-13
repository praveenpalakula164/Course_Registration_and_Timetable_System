-- ====================================================================
-- COURSE REGISTRATION & TIMETABLE SYSTEM
-- MySQL Database Creation & Initial Seed Script
-- Academic Configuration: 2nd Year, 1st Semester
-- ====================================================================

CREATE DATABASE IF NOT EXISTS college_registration;
USE college_registration;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STUDENT', 'FACULTY')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Branches Table
CREATE TABLE IF NOT EXISTS branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_code VARCHAR(10) UNIQUE NOT NULL,
    branch_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    branch_id INT NOT NULL,
    year INT NOT NULL DEFAULT 2,
    semester INT NOT NULL DEFAULT 1,
    max_credits INT NOT NULL DEFAULT 24,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    faculty_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    capacity INT NOT NULL DEFAULT 60,
    year INT NOT NULL DEFAULT 2,
    semester INT NOT NULL DEFAULT 1,
    status VARCHAR(20) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Branch Courses Mapping
CREATE TABLE IF NOT EXISTS branch_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT NOT NULL,
    course_id INT NOT NULL,
    semester INT NOT NULL DEFAULT 1,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_branch_course (branch_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Prerequisites Table
CREATE TABLE IF NOT EXISTS prerequisites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    required_course_id INT NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (required_course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_prereq (course_id, required_course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Classrooms Table
CREATE TABLE IF NOT EXISTS classrooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    building VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Timetable Table
CREATE TABLE IF NOT EXISTS timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    branch_id INT NOT NULL,
    faculty_id INT NOT NULL,
    classroom_id INT NOT NULL,
    day VARCHAR(15) NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'REGISTERED',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_course (student_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Grades / Passed Prerequisites Table
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade VARCHAR(5) NOT NULL,
    semester INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Academic Settings Table
CREATE TABLE IF NOT EXISTS academic_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- INITIAL DATA SEEDING
-- ====================================================================

-- Insert Branches
INSERT IGNORE INTO branches (id, branch_code, branch_name) VALUES
(1, 'AIDS', 'Artificial Intelligence & Data Science'),
(2, 'CSM', 'Computer Science & Machine Learning'),
(3, 'CSD', 'Computer Science & Data Science'),
(4, 'CAI', 'Computer Science & Artificial Intelligence'),
(5, 'CSC', 'Computer Science & Cyber Security');

-- Insert Courses (2nd Year 1st Semester)
INSERT IGNORE INTO courses (id, course_code, course_name, credits, capacity, year, semester, status) VALUES
(1, 'DMGT', 'Discrete Mathematics & Graph Theory', 4, 60, 2, 1, 'ACTIVE'),
(2, 'UHV', 'Universal Human Values', 3, 60, 2, 1, 'ACTIVE'),
(3, 'ADS', 'Advanced Data Structures', 4, 60, 2, 1, 'ACTIVE'),
(4, 'JAVA', 'Java Programming', 4, 60, 2, 1, 'ACTIVE'),
(5, 'DBMS', 'Database Management Systems', 4, 60, 2, 1, 'ACTIVE'),
(6, 'AI', 'Artificial Intelligence Fundamentals', 4, 60, 2, 1, 'ACTIVE'),
(7, 'IDS', 'Introduction to Data Science', 4, 60, 2, 1, 'ACTIVE'),
(8, 'DLCO', 'Digital Logic & Computer Organization', 4, 60, 2, 1, 'ACTIVE'),
(9, 'ADBMS', 'Advanced Database Systems', 4, 60, 2, 1, 'ACTIVE');

-- Map Courses to Branches (Exact Requirement)
-- Common Subjects: DMGT, UHV, ADS, JAVA
-- AIDS: + DBMS
-- CSM: + AI
-- CSD: + IDS
-- CAI: + AI
-- CSC: + DLCO

-- AIDS Courses
INSERT IGNORE INTO branch_courses (branch_id, course_id, semester) VALUES
(1, 1, 1), (1, 2, 1), (1, 3, 1), (1, 4, 1), (1, 5, 1);

-- CSM Courses
INSERT IGNORE INTO branch_courses (branch_id, course_id, semester) VALUES
(2, 1, 1), (2, 2, 1), (2, 3, 1), (2, 4, 1), (2, 6, 1);

-- CSD Courses
INSERT IGNORE INTO branch_courses (branch_id, course_id, semester) VALUES
(3, 1, 1), (3, 2, 1), (3, 3, 1), (3, 4, 1), (3, 7, 1);

-- CAI Courses
INSERT IGNORE INTO branch_courses (branch_id, course_id, semester) VALUES
(4, 1, 1), (4, 2, 1), (4, 3, 1), (4, 4, 1), (4, 6, 1);

-- CSC Courses
INSERT IGNORE INTO branch_courses (branch_id, course_id, semester) VALUES
(5, 1, 1), (5, 2, 1), (5, 3, 1), (5, 4, 1), (5, 8, 1);

-- Map Prerequisites (ADBMS -> DBMS)
INSERT IGNORE INTO prerequisites (id, course_id, required_course_id, description, status) VALUES
(1, 9, 5, 'DBMS is required before registering for Advanced Database Systems (ADBMS)', 'ACTIVE');

-- Classrooms
INSERT IGNORE INTO classrooms (id, room_number, building, capacity, status) VALUES
(1, 'LH-101', 'Academic Block A', 60, 'AVAILABLE'),
(2, 'LH-102', 'Academic Block A', 60, 'AVAILABLE'),
(3, 'LAB-201', 'Technology Center', 40, 'AVAILABLE'),
(4, 'LAB-202', 'Technology Center', 40, 'AVAILABLE');

-- Academic Settings
INSERT IGNORE INTO academic_settings (setting_key, setting_value) VALUES
('current_academic_year', '2'),
('current_semester', '1'),
('max_credit_limit', '24'),
('college_start_time', '09:00'),
('college_end_time', '16:30');
