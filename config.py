import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-academic-key-2026-red-orange-black')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-college-registration-2026')
    
    # Priority: MySQL environment URI -> fallback to SQLite local file for zero-config execution
    MYSQL_DB_URI = os.environ.get('MYSQL_URI', 'mysql+pymysql://root:password@localhost/college_registration')
    SQLITE_DB_URI = 'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'college_registration.db')
    
    # Enable SQLite fallback if MySQL is not reachable or specified
    USE_MYSQL = os.environ.get('USE_MYSQL', 'false').lower() == 'true'
    SQLALCHEMY_DATABASE_URI = MYSQL_DB_URI if USE_MYSQL else SQLITE_DB_URI
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
