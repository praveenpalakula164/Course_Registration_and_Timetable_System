from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.models import (
    db, User, Branch, Student, Faculty, Course, 
    BranchCourse, Prerequisite, Classroom, Timetable, 
    Registration, AcademicSetting
)
from app.services.validation_service import TimetableConflictService

academic_bp = Blueprint('academic', __name__, url_prefix='/api')

def check_admin():
    claims = get_jwt()
    return claims and claims.get('role') == 'ADMIN'

# ==========================================
# 1. BRANCHES
# ==========================================
@academic_bp.route('/branches', methods=['GET'])
def get_branches():
    branches = Branch.query.all()
    return jsonify([b.to_dict() for b in branches]), 200

@academic_bp.route('/branches', methods=['POST'])
@jwt_required()
def create_branch():
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    data = request.get_json(force=True, silent=True) or {}
    code = data.get('branch_code', '').strip().upper()
    name = data.get('branch_name', '').strip()

    if not code or not name:
        return jsonify({'message': 'Branch code and name are required.'}), 400

    if Branch.query.filter_by(branch_code=code).first():
        return jsonify({'message': f'Branch with code {code} already exists.'}), 400

    branch = Branch(branch_code=code, branch_name=name)
    db.session.add(branch)
    db.session.commit()
    return jsonify(branch.to_dict()), 201

# ==========================================
# 2. COURSES
# ==========================================
@academic_bp.route('/courses', methods=['GET'])
def get_courses():
    branch_id = request.args.get('branch_id', type=int)
    year = request.args.get('year', type=int, default=2)
    semester = request.args.get('semester', type=int, default=1)

    query = Course.query.filter_by(year=year, semester=semester)

    if branch_id:
        mapped_course_ids = [bc.course_id for bc in BranchCourse.query.filter_by(branch_id=branch_id).all()]
        query = query.filter(Course.id.in_(mapped_course_ids))

    courses = query.all()
    return jsonify([c.to_dict() for c in courses]), 200

@academic_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    course = Course.query.get_or_404(course_id)
    prereqs = Prerequisite.query.filter_by(course_id=course.id, status='ACTIVE').all()
    branch_ids = [bc.branch_id for bc in BranchCourse.query.filter_by(course_id=course.id).all()]
    branches = Branch.query.filter(Branch.id.in_(branch_ids)).all() if branch_ids else []
    
    result = course.to_dict()
    result['prerequisites'] = [p.to_dict() for p in prereqs]
    result['branches'] = [b.to_dict() for b in branches]
    return jsonify(result), 200

@academic_bp.route('/courses', methods=['POST'])
@jwt_required()
def create_course():
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    data = request.get_json(force=True, silent=True) or {}
    code = data.get('course_code', '').strip().upper()
    name = data.get('course_name', '').strip()
    credits_val = data.get('credits', 4)
    capacity_val = data.get('capacity', 60)
    year_val = data.get('year', 2)
    sem_val = data.get('semester', 1)
    branch_ids = data.get('branch_ids', [])

    if not code or not name:
        return jsonify({'message': 'Course code and course name are required.'}), 400

    if Course.query.filter_by(course_code=code).first():
        return jsonify({'message': f'Course {code} already exists.'}), 400

    course = Course(
        course_code=code,
        course_name=name,
        credits=int(credits_val),
        capacity=int(capacity_val),
        year=int(year_val),
        semester=int(sem_val),
        status='ACTIVE'
    )
    db.session.add(course)
    db.session.commit()

    # Add branch mappings
    for b_id in branch_ids:
        db.session.add(BranchCourse(branch_id=int(b_id), course_id=course.id, semester=int(sem_val)))
    db.session.commit()

    return jsonify(course.to_dict()), 201

@academic_bp.route('/courses/<int:course_id>', methods=['PUT'])
@jwt_required()
def update_course(course_id):
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    course = Course.query.get_or_404(course_id)
    data = request.get_json(force=True, silent=True) or {}

    course.course_name = data.get('course_name', course.course_name)
    course.credits = int(data.get('credits', course.credits))
    course.capacity = int(data.get('capacity', course.capacity))
    course.status = data.get('status', course.status)

    if 'branch_ids' in data:
        BranchCourse.query.filter_by(course_id=course.id).delete()
        for b_id in data['branch_ids']:
            db.session.add(BranchCourse(branch_id=int(b_id), course_id=course.id, semester=course.semester))

    db.session.commit()
    return jsonify(course.to_dict()), 200

@academic_bp.route('/courses/<int:course_id>', methods=['DELETE'])
@jwt_required()
def delete_course(course_id):
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    db.session.commit()
    return jsonify({'message': f'Course {course.course_code} deleted successfully.'}), 200

# ==========================================
# 3. PREREQUISITES
# ==========================================
@academic_bp.route('/prerequisites', methods=['GET'])
def get_prerequisites():
    prereqs = Prerequisite.query.all()
    return jsonify([p.to_dict() for p in prereqs]), 200

@academic_bp.route('/prerequisites', methods=['POST'])
@jwt_required()
def create_prerequisite():
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    data = request.get_json(force=True, silent=True) or {}
    course_id = data.get('course_id')
    req_id = data.get('required_course_id')
    desc = data.get('description', '')

    if not course_id or not req_id:
        return jsonify({'message': 'Course ID and Required Course ID are required.'}), 400

    if int(course_id) == int(req_id):
        return jsonify({'message': 'A course cannot be its own prerequisite.'}), 400

    existing = Prerequisite.query.filter_by(course_id=course_id, required_course_id=req_id).first()
    if existing:
        return jsonify({'message': 'Prerequisite mapping already exists.'}), 400

    prereq = Prerequisite(course_id=course_id, required_course_id=req_id, description=desc, status='ACTIVE')
    db.session.add(prereq)
    db.session.commit()
    return jsonify(prereq.to_dict()), 201

@academic_bp.route('/prerequisites/<int:prereq_id>', methods=['DELETE'])
@jwt_required()
def delete_prerequisite(prereq_id):
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    prereq = Prerequisite.query.get_or_404(prereq_id)
    db.session.delete(prereq)
    db.session.commit()
    return jsonify({'message': 'Prerequisite deleted.'}), 200

# ==========================================
# 4. CLASSROOMS
# ==========================================
@academic_bp.route('/classrooms', methods=['GET'])
def get_classrooms():
    rooms = Classroom.query.all()
    return jsonify([r.to_dict() for r in rooms]), 200

@academic_bp.route('/classrooms', methods=['POST'])
@jwt_required()
def create_classroom():
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    data = request.get_json(force=True, silent=True) or {}
    room_number = data.get('room_number', '').strip()
    building = data.get('building', '').strip()
    capacity = int(data.get('capacity', 60))

    if not room_number or not building:
        return jsonify({'message': 'Room number and building are required.'}), 400

    if Classroom.query.filter_by(room_number=room_number).first():
        return jsonify({'message': f'Classroom {room_number} already exists.'}), 400

    room = Classroom(room_number=room_number, building=building, capacity=capacity, status='AVAILABLE')
    db.session.add(room)
    db.session.commit()
    return jsonify(room.to_dict()), 201

# ==========================================
# 5. TIMETABLE
# ==========================================
@academic_bp.route('/timetable', methods=['GET'])
def get_timetable():
    branch_id = request.args.get('branch_id', type=int)
    faculty_id = request.args.get('faculty_id', type=int)

    query = Timetable.query

    if branch_id:
        query = query.filter_by(branch_id=branch_id)
    if faculty_id:
        query = query.filter_by(faculty_id=faculty_id)

    slots = query.all()
    return jsonify([s.to_dict() for s in slots]), 200

@academic_bp.route('/timetable', methods=['POST'])
@jwt_required()
def create_timetable_slot():
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    data = request.get_json(force=True, silent=True) or {}
    c_id = data.get('course_id')
    b_id = data.get('branch_id')
    f_id = data.get('faculty_id')
    r_id = data.get('classroom_id')
    day = data.get('day', '').strip()
    start_t = data.get('start_time', '').strip()
    end_t = data.get('end_time', '').strip()

    if not all([c_id, b_id, f_id, r_id, day, start_t, end_t]):
        return jsonify({'message': 'All timetable fields (course, branch, faculty, classroom, day, start_time, end_time) are required.'}), 400

    # Conflict Check Service
    is_valid, msg = TimetableConflictService.validate_timetable_slot(
        course_id=c_id,
        branch_id=b_id,
        faculty_id=f_id,
        classroom_id=r_id,
        day=day,
        start_time=start_t,
        end_time=end_t
    )

    if not is_valid:
        return jsonify({'message': msg}), 409

    slot = Timetable(
        course_id=c_id,
        branch_id=b_id,
        faculty_id=f_id,
        classroom_id=r_id,
        day=day,
        start_time=start_t,
        end_time=end_t
    )
    db.session.add(slot)
    db.session.commit()
    return jsonify(slot.to_dict()), 201

@academic_bp.route('/timetable/<int:slot_id>', methods=['DELETE'])
@jwt_required()
def delete_timetable_slot(slot_id):
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    slot = Timetable.query.get_or_404(slot_id)
    db.session.delete(slot)
    db.session.commit()
    return jsonify({'message': 'Timetable slot deleted.'}), 200

# ==========================================
# 6. STUDENTS & FACULTY CRUD
# ==========================================
@academic_bp.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students]), 200

@academic_bp.route('/students/<int:student_id>', methods=['GET'])
def get_student_detail(student_id):
    student = Student.query.get_or_404(student_id)
    return jsonify(student.to_dict()), 200

@academic_bp.route('/students', methods=['POST'])
@jwt_required()
def create_student():
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    data = request.get_json(force=True, silent=True) or {}
    roll = data.get('roll_number', '').strip()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    branch_id = data.get('branch_id')
    pwd = data.get('password', 'student123')

    if not roll or not name or not email or not branch_id:
        return jsonify({'message': 'Roll number, name, email, and branch are required.'}), 400

    if User.query.filter_by(username=roll.lower()).first():
        return jsonify({'message': f'Student roll number {roll} already exists.'}), 400

    user = User(username=roll.lower(), email=email, role='STUDENT')
    user.set_password(pwd)
    db.session.add(user)
    db.session.commit()

    student = Student(
        user_id=user.id,
        roll_number=roll,
        name=name,
        email=email,
        branch_id=branch_id,
        year=2,
        semester=1,
        max_credits=24
    )
    db.session.add(student)
    db.session.commit()
    return jsonify(student.to_dict()), 201

@academic_bp.route('/faculty', methods=['GET'])
def get_faculty():
    faculty_list = Faculty.query.all()
    return jsonify([f.to_dict() for f in faculty_list]), 200

@academic_bp.route('/faculty', methods=['POST'])
@jwt_required()
def create_faculty():
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    data = request.get_json(force=True, silent=True) or {}
    code = data.get('faculty_code', '').strip()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    dept = data.get('department', '').strip()
    pwd = data.get('password', 'faculty123')

    if not code or not name or not email or not dept:
        return jsonify({'message': 'Faculty code, name, email, and department are required.'}), 400

    user = User(username=code.lower(), email=email, role='FACULTY')
    user.set_password(pwd)
    db.session.add(user)
    db.session.commit()

    faculty = Faculty(
        user_id=user.id,
        faculty_code=code,
        name=name,
        email=email,
        department=dept
    )
    db.session.add(faculty)
    db.session.commit()
    return jsonify(faculty.to_dict()), 201

# ==========================================
# 7. ACADEMIC SETTINGS
# ==========================================
@academic_bp.route('/settings', methods=['GET'])
def get_settings():
    settings = AcademicSetting.query.all()
    return jsonify({s.setting_key: s.setting_value for s in settings}), 200

@academic_bp.route('/settings', methods=['POST'])
@jwt_required()
def update_settings():
    if not check_admin():
        return jsonify({'message': 'HTTP 403 Forbidden: Admin access required.'}), 403

    data = request.get_json(force=True, silent=True) or {}
    for key, val in data.items():
        setting = AcademicSetting.query.filter_by(setting_key=key).first()
        if setting:
            setting.setting_value = str(val)
        else:
            db.session.add(AcademicSetting(setting_key=key, setting_value=str(val)))

    db.session.commit()
    return jsonify({'message': 'Academic settings updated successfully.'}), 200
