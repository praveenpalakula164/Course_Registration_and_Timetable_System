from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.models import db, Registration, Student, Course
from app.services.validation_service import RegistrationValidationService

registration_bp = Blueprint('registration', __name__, url_prefix='/api/registrations')

@registration_bp.route('/validate', methods=['POST'])
@jwt_required()
def validate_registration_preview():
    """Real-time validation dry-run precheck."""
    data = request.get_json(force=True, silent=True) or {}
    student_id = data.get('student_id')
    course_id = data.get('course_id')

    if not student_id or not course_id:
        return jsonify({'message': 'Student ID and Course ID are required.'}), 400

    is_valid, msg, details = RegistrationValidationService.validate_course_registration(int(student_id), int(course_id))

    return jsonify({
        'valid': is_valid,
        'message': msg,
        'details': details
    }), 200

@registration_bp.route('', methods=['POST'])
@jwt_required()
def register_course():
    data = request.get_json(force=True, silent=True) or {}
    claims = get_jwt()
    role = claims.get('role')
    jwt_user_id = claims.get('id') or get_jwt_identity()

    student_id = data.get('student_id')
    course_id = data.get('course_id')

    # If student is logged in, resolve student ID from student profile safely
    if role == 'STUDENT' or not student_id:
        student = Student.query.filter_by(user_id=int(jwt_user_id)).first()
        if not student:
            return jsonify({'message': 'Student profile not found.'}), 404
        student_id = student.id

    if not student_id or not course_id:
        return jsonify({'message': 'Student ID and Course ID are required.'}), 400

    # Execute 10-step Validation Engine
    is_valid, error_msg, details = RegistrationValidationService.validate_course_registration(int(student_id), int(course_id))

    if not is_valid:
        return jsonify({
            'success': False,
            'message': error_msg,
            'details': details
        }), 400

    # Validation passed - Create Registration record
    new_reg = Registration(
        student_id=int(student_id),
        course_id=int(course_id),
        status='REGISTERED'
    )
    db.session.add(new_reg)
    db.session.commit()

    course = Course.query.get(int(course_id))
    student = Student.query.get(int(student_id))

    # Calculate remaining credits
    regs = Registration.query.filter_by(student_id=student.id, status='REGISTERED').all()
    total_credits = sum([r.course.credits for r in regs if r.course])

    return jsonify({
        'success': True,
        'message': f"Successfully registered for {course.course_name} ({course.course_code}).",
        'registration': new_reg.to_dict(),
        'total_credits': total_credits,
        'remaining_credits': student.max_credits - total_credits
    }), 201

@registration_bp.route('/student/<int:student_id>', methods=['GET'])
def get_student_registrations(student_id):
    student = Student.query.get_or_404(student_id)
    regs = Registration.query.filter_by(student_id=student.id, status='REGISTERED').all()
    
    total_credits = sum([r.course.credits for r in regs if r.course])
    
    return jsonify({
        'student': student.to_dict(),
        'registrations': [r.to_dict() for r in regs],
        'total_credits': total_credits,
        'max_credits': student.max_credits,
        'remaining_credits': student.max_credits - total_credits
    }), 200

@registration_bp.route('/<int:registration_id>', methods=['DELETE'])
@jwt_required()
def drop_registration(registration_id):
    claims = get_jwt()
    role = claims.get('role')
    jwt_user_id = claims.get('id') or get_jwt_identity()

    reg = Registration.query.get_or_404(registration_id)

    # Security check: Student can drop own course, Admin can drop any course
    if role == 'STUDENT':
        student = Student.query.filter_by(user_id=int(jwt_user_id)).first()
        if not student or reg.student_id != student.id:
            return jsonify({'message': 'HTTP 403 Forbidden: You can only drop your own registrations.'}), 403

    course_name = reg.course.course_name if reg.course else 'Course'
    db.session.delete(reg)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f"Course '{course_name}' dropped successfully."
    }), 200

@registration_bp.route('/history/<int:student_id>', methods=['GET'])
def get_registration_history(student_id):
    regs = Registration.query.filter_by(student_id=student_id).order_by(Registration.registration_date.desc()).all()
    return jsonify([r.to_dict() for r in regs]), 200
