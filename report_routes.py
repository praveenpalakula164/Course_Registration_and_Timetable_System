from flask import Blueprint, jsonify
from app.models.models import (
    db, Student, Branch, Course, BranchCourse, 
    Prerequisite, Timetable, Registration, Classroom, Faculty
)

report_bp = Blueprint('report', __name__, url_prefix='/api/reports')

@report_bp.route('/registrations', methods=['GET'])
def report_registrations():
    registrations = Registration.query.all()
    return jsonify({
        'total_registrations': len(registrations),
        'active_registrations': len([r for r in registrations if r.status == 'REGISTERED']),
        'list': [r.to_dict() for r in registrations]
    }), 200

@report_bp.route('/branch-wise', methods=['GET'])
def report_branch_wise():
    branches = Branch.query.all()
    result = []
    for b in branches:
        students_count = Student.query.filter_by(branch_id=b.id).count()
        mapped_courses = BranchCourse.query.filter_by(branch_id=b.id).count()
        student_ids = [s.id for s in Student.query.filter_by(branch_id=b.id).all()]
        regs_count = Registration.query.filter(Registration.student_id.in_(student_ids)).count() if student_ids else 0

        result.append({
            'branch_code': b.branch_code,
            'branch_name': b.branch_name,
            'total_students': students_count,
            'total_mapped_courses': mapped_courses,
            'total_registrations': regs_count
        })
    return jsonify(result), 200

@report_bp.route('/course-enrollment', methods=['GET'])
def report_course_enrollment():
    courses = Course.query.all()
    result = []
    for c in courses:
        registered_count = Registration.query.filter_by(course_id=c.id, status='REGISTERED').count()
        occupancy_pct = round((registered_count / c.capacity) * 100, 1) if c.capacity > 0 else 0
        result.append({
            'course_code': c.course_code,
            'course_name': c.course_name,
            'credits': c.credits,
            'capacity': c.capacity,
            'enrolled': registered_count,
            'available_seats': max(0, c.capacity - registered_count),
            'occupancy_percentage': occupancy_pct
        })
    return jsonify(result), 200

@report_bp.route('/capacity', methods=['GET'])
def report_capacity():
    courses = Course.query.all()
    full_courses = []
    available_courses = []

    for c in courses:
        c_dict = c.to_dict()
        if c_dict['available_seats'] == 0:
            full_courses.append(c_dict)
        else:
            available_courses.append(c_dict)

    return jsonify({
        'total_courses': len(courses),
        'full_courses_count': len(full_courses),
        'available_courses_count': len(available_courses),
        'full_courses': full_courses,
        'available_courses': available_courses
    }), 200

@report_bp.route('/timetable', methods=['GET'])
def report_timetable():
    slots = Timetable.query.all()
    return jsonify({
        'total_slots': len(slots),
        'slots': [s.to_dict() for s in slots]
    }), 200

@report_bp.route('/clashes', methods=['GET'])
def report_clashes():
    slots = Timetable.query.all()
    clashes = []
    for i in range(len(slots)):
        for j in range(i + 1, len(slots)):
            s1 = slots[i]
            s2 = slots[j]
            if s1.day == s2.day:
                # Check faculty clash
                if s1.faculty_id == s2.faculty_id:
                    clashes.append({
                        'type': 'FACULTY_CLASH',
                        'description': f"Faculty {s1.faculty.name if s1.faculty else ''} assigned to two classes at {s1.day} {s1.start_time}-{s1.end_time}",
                        'slot1': s1.to_dict(),
                        'slot2': s2.to_dict()
                    })
                # Check classroom clash
                if s1.classroom_id == s2.classroom_id:
                    clashes.append({
                        'type': 'CLASSROOM_CLASH',
                        'description': f"Classroom {s1.classroom.room_number if s1.classroom else ''} booked for two classes at {s1.day} {s1.start_time}-{s1.end_time}",
                        'slot1': s1.to_dict(),
                        'slot2': s2.to_dict()
                    })
    return jsonify({
        'clash_count': len(clashes),
        'clashes': clashes
    }), 200

@report_bp.route('/prerequisites', methods=['GET'])
def report_prerequisites():
    prereqs = Prerequisite.query.all()
    return jsonify([p.to_dict() for p in prereqs]), 200

@report_bp.route('/faculty-schedule', methods=['GET'])
def report_faculty_schedule():
    faculty_list = Faculty.query.all()
    result = []
    for f in faculty_list:
        f_slots = Timetable.query.filter_by(faculty_id=f.id).all()
        result.append({
            'faculty': f.to_dict(),
            'total_assigned_slots': len(f_slots),
            'slots': [s.to_dict() for s in f_slots]
        })
    return jsonify(result), 200

@report_bp.route('/classroom-schedule', methods=['GET'])
def report_classroom_schedule():
    rooms = Classroom.query.all()
    result = []
    for r in rooms:
        r_slots = Timetable.query.filter_by(classroom_id=r.id).all()
        result.append({
            'classroom': r.to_dict(),
            'total_scheduled_slots': len(r_slots),
            'slots': [s.to_dict() for s in r_slots]
        })
    return jsonify(result), 200
