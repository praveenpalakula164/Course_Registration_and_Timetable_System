from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from app.models.models import db, User, Student, Faculty

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True, silent=True) or {}
    username = str(data.get('username', '')).strip()
    password = str(data.get('password', '')).strip()
    role = str(data.get('role', '')).strip().upper()

    if not username or not password:
        return jsonify({'message': 'Username and password are required.'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid username or password.'}), 401

    if role and user.role != role:
        return jsonify({'message': f'Access denied. Account is registered as {user.role}, not {role}.'}), 403

    # Pass string ID as identity, role and username in additional claims
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={'role': user.role, 'username': user.username, 'id': user.id}
    )

    profile_data = {}
    if user.role == 'STUDENT' and user.student_profile:
        profile_data = user.student_profile.to_dict()
    elif user.role == 'FACULTY' and user.faculty_profile:
        profile_data = user.faculty_profile.to_dict()

    return jsonify({
        'token': access_token,
        'user': user.to_dict(),
        'profile': profile_data
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    claims = get_jwt()
    user_id = claims.get('id') or get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'message': 'User not found'}), 404

    profile_data = {}
    if user.role == 'STUDENT' and user.student_profile:
        profile_data = user.student_profile.to_dict()
    elif user.role == 'FACULTY' and user.faculty_profile:
        profile_data = user.faculty_profile.to_dict()

    return jsonify({
        'user': user.to_dict(),
        'profile': profile_data
    }), 200
