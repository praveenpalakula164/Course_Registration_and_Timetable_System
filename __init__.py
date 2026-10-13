from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from app.models.models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    jwt = JWTManager(app)

    # Custom JWT Error Handlers
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'message': 'Authorization token required.', 'error': 'authorization_required'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'message': 'Invalid authentication token.', 'error': 'invalid_token'}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'message': 'Session expired. Please log in again.', 'error': 'token_expired'}), 401

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.academic_routes import academic_bp
    from app.routes.registration_routes import registration_bp
    from app.routes.report_routes import report_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(academic_bp)
    app.register_blueprint(registration_bp)
    app.register_blueprint(report_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'ONLINE', 'system': 'Course Registration & Timetable System'}), 200

    return app
