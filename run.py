import os
from app import create_app, db
from app.services.seed_data import seed_database

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Database schema verified.")
            seed_database()
        except Exception as e:
            print(f"Database initialization note: {e}")
            
    port = int(os.environ.get('PORT', 5005))
    print(f"Starting Course Registration & Timetable Backend API on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
