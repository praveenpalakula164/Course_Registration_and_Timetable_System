from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)  # ADMIN, STUDENT, FACULTY
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student_profile = db.relationship('Student', backref='user', uselist=False, cascade="all, delete-orphan")
    faculty_profile = db.relationship('Faculty', backref='user', uselist=False, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role
        }

class Branch(db.Model):
    __tablename__ = 'branches'
    id = db.Column(db.Integer, primary_key=True)
    branch_code = db.Column(db.String(10), unique=True, nullable=False)
    branch_name = db.Column(db.String(100), nullable=False)

    students = db.relationship('Student', backref='branch', lazy=True)
    branch_courses = db.relationship('BranchCourse', backref='branch', cascade="all, delete-orphan")
    timetable_slots = db.relationship('Timetable', backref='branch', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'branch_code': self.branch_code,
            'branch_name': self.branch_name
        }

class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), unique=True, nullable=False)
    roll_number = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id', ondelete="CASCADE"), nullable=False)
    year = db.Column(db.Integer, default=2, nullable=False)
    semester = db.Column(db.Integer, default=1, nullable=False)
    max_credits = db.Column(db.Integer, default=24, nullable=False)
    status = db.Column(db.String(20), default='ACTIVE')

    registrations = db.relationship('Registration', backref='student', cascade="all, delete-orphan")
    grades = db.relationship('Grade', backref='student', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'roll_number': self.roll_number,
            'name': self.name,
            'email': self.email,
            'branch_id': self.branch_id,
            'branch_code': self.branch.branch_code if self.branch else '',
            'branch_name': self.branch.branch_name if self.branch else '',
            'year': self.year,
            'semester': self.semester,
            'max_credits': self.max_credits,
            'status': self.status
        }

class Faculty(db.Model):
    __tablename__ = 'faculty'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), unique=True, nullable=False)
    faculty_code = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'faculty_code': self.faculty_code,
            'name': self.name,
            'email': self.email,
            'department': self.department
        }

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    course_code = db.Column(db.String(20), unique=True, nullable=False)
    course_name = db.Column(db.String(100), nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    capacity = db.Column(db.Integer, default=60, nullable=False)
    year = db.Column(db.Integer, default=2, nullable=False)
    semester = db.Column(db.Integer, default=1, nullable=False)
    status = db.Column(db.String(20), default='ACTIVE')

    branch_mappings = db.relationship('BranchCourse', backref='course', cascade="all, delete-orphan")
    prerequisites = db.relationship('Prerequisite', foreign_keys='Prerequisite.course_id', backref='target_course', cascade="all, delete-orphan")
    registrations = db.relationship('Registration', backref='course', cascade="all, delete-orphan")

    def to_dict(self):
        registered_count = Registration.query.filter_by(course_id=self.id, status='REGISTERED').count()
        return {
            'id': self.id,
            'course_code': self.course_code,
            'course_name': self.course_name,
            'credits': self.credits,
            'capacity': self.capacity,
            'enrolled': registered_count,
            'available_seats': max(0, self.capacity - registered_count),
            'year': self.year,
            'semester': self.semester,
            'status': self.status
        }

class BranchCourse(db.Model):
    __tablename__ = 'branch_courses'
    id = db.Column(db.Integer, primary_key=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id', ondelete="CASCADE"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete="CASCADE"), nullable=False)
    semester = db.Column(db.Integer, default=1, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'branch_id': self.branch_id,
            'branch_code': self.branch.branch_code if self.branch else '',
            'course_id': self.course_id,
            'course_code': self.course.course_code if self.course else '',
            'course_name': self.course.course_name if self.course else '',
            'semester': self.semester
        }

class Prerequisite(db.Model):
    __tablename__ = 'prerequisites'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete="CASCADE"), nullable=False)
    required_course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete="CASCADE"), nullable=False)
    description = db.Column(db.String(255))
    status = db.Column(db.String(20), default='ACTIVE')

    required_course = db.relationship('Course', foreign_keys=[required_course_id])

    def to_dict(self):
        return {
            'id': self.id,
            'course_id': self.course_id,
            'course_code': self.target_course.course_code if self.target_course else '',
            'course_name': self.target_course.course_name if self.target_course else '',
            'required_course_id': self.required_course_id,
            'required_course_code': self.required_course.course_code if self.required_course else '',
            'required_course_name': self.required_course.course_name if self.required_course else '',
            'description': self.description,
            'status': self.status
        }

class Classroom(db.Model):
    __tablename__ = 'classrooms'
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(20), unique=True, nullable=False)
    building = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='AVAILABLE')

    def to_dict(self):
        return {
            'id': self.id,
            'room_number': self.room_number,
            'building': self.building,
            'capacity': self.capacity,
            'status': self.status
        }

class Timetable(db.Model):
    __tablename__ = 'timetable'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete="CASCADE"), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id', ondelete="CASCADE"), nullable=False)
    faculty_id = db.Column(db.Integer, db.ForeignKey('faculty.id', ondelete="CASCADE"), nullable=False)
    classroom_id = db.Column(db.Integer, db.ForeignKey('classrooms.id', ondelete="CASCADE"), nullable=False)
    day = db.Column(db.String(15), nullable=False)  # Monday, Tuesday, etc.
    start_time = db.Column(db.String(10), nullable=False)  # HH:MM format e.g. "09:00"
    end_time = db.Column(db.String(10), nullable=False)    # HH:MM format e.g. "10:30"

    course = db.relationship('Course', foreign_keys=[course_id])
    faculty = db.relationship('Faculty', foreign_keys=[faculty_id])
    classroom = db.relationship('Classroom', foreign_keys=[classroom_id])

    def to_dict(self):
        return {
            'id': self.id,
            'course_id': self.course_id,
            'course_code': self.course.course_code if self.course else '',
            'course_name': self.course.course_name if self.course else '',
            'credits': self.course.credits if self.course else 0,
            'branch_id': self.branch_id,
            'branch_code': self.branch.branch_code if self.branch else '',
            'faculty_id': self.faculty_id,
            'faculty_name': self.faculty.name if self.faculty else '',
            'classroom_id': self.classroom_id,
            'room_number': self.classroom.room_number if self.classroom else '',
            'building': self.classroom.building if self.classroom else '',
            'day': self.day,
            'start_time': self.start_time,
            'end_time': self.end_time
        }

class Registration(db.Model):
    __tablename__ = 'registrations'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete="CASCADE"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete="CASCADE"), nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='REGISTERED')

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student.name if self.student else '',
            'roll_number': self.student.roll_number if self.student else '',
            'course_id': self.course_id,
            'course_code': self.course.course_code if self.course else '',
            'course_name': self.course.course_name if self.course else '',
            'credits': self.course.credits if self.course else 0,
            'registration_date': self.registration_date.strftime('%Y-%m-%d %H:%M:%S'),
            'status': self.status
        }

class Grade(db.Model):
    __tablename__ = 'grades'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete="CASCADE"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete="CASCADE"), nullable=False)
    grade = db.Column(db.String(5), nullable=False)
    semester = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'course_id': self.course_id,
            'grade': self.grade,
            'semester': self.semester
        }

class AcademicSetting(db.Model):
    __tablename__ = 'academic_settings'
    id = db.Column(db.Integer, primary_key=True)
    setting_key = db.Column(db.String(50), unique=True, nullable=False)
    setting_value = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'setting_key': self.setting_key,
            'setting_value': self.setting_value
        }
