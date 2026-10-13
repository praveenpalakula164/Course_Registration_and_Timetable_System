from app.models.models import (
    db, User, Branch, Student, Faculty, Course, 
    BranchCourse, Prerequisite, Classroom, Timetable, 
    Registration, Grade, AcademicSetting
)

def seed_database():
    """Seed initial data with exact branch-wise subjects as per academic specification."""
    # Check if branches exist
    if Branch.query.count() == 0:
        print("Seeding initial academic branches...")
        b_aids = Branch(branch_code='AIDS', branch_name='Artificial Intelligence & Data Science')
        b_csm = Branch(branch_code='CSM', branch_name='Computer Science & Machine Learning')
        b_csd = Branch(branch_code='CSD', branch_name='Computer Science & Data Science')
        b_cai = Branch(branch_code='CAI', branch_name='Computer Science & Artificial Intelligence')
        b_csc = Branch(branch_code='CSC', branch_name='Computer Science & Cyber Security')
        
        db.session.add_all([b_aids, b_csm, b_csd, b_cai, b_csc])
        db.session.commit()

    # Get branch references
    aids = Branch.query.filter_by(branch_code='AIDS').first()
    csm = Branch.query.filter_by(branch_code='CSM').first()
    csd = Branch.query.filter_by(branch_code='CSD').first()
    cai = Branch.query.filter_by(branch_code='CAI').first()
    csc = Branch.query.filter_by(branch_code='CSC').first()

    # Seed Courses
    if Course.query.count() == 0:
        print("Seeding courses...")
        c_dmgt = Course(course_code='DMGT', course_name='Discrete Mathematics & Graph Theory', credits=4, capacity=60, year=2, semester=1)
        c_uhv = Course(course_code='UHV', course_name='Universal Human Values', credits=3, capacity=60, year=2, semester=1)
        c_ads = Course(course_code='ADS', course_name='Advanced Data Structures', credits=4, capacity=60, year=2, semester=1)
        c_java = Course(course_code='JAVA', course_name='Java Programming', credits=4, capacity=60, year=2, semester=1)
        c_dbms = Course(course_code='DBMS', course_name='Database Management Systems', credits=4, capacity=60, year=2, semester=1)
        c_ai = Course(course_code='AI', course_name='Artificial Intelligence Fundamentals', credits=4, capacity=60, year=2, semester=1)
        c_ids = Course(course_code='IDS', course_name='Introduction to Data Science', credits=4, capacity=60, year=2, semester=1)
        c_dlco = Course(course_code='DLCO', course_name='Digital Logic & Computer Organization', credits=4, capacity=60, year=2, semester=1)
        c_adbms = Course(course_code='ADBMS', course_name='Advanced Database Systems', credits=4, capacity=60, year=2, semester=1)

        db.session.add_all([c_dmgt, c_uhv, c_ads, c_java, c_dbms, c_ai, c_ids, c_dlco, c_adbms])
        db.session.commit()

    # Get course references
    dmgt = Course.query.filter_by(course_code='DMGT').first()
    uhv = Course.query.filter_by(course_code='UHV').first()
    ads = Course.query.filter_by(course_code='ADS').first()
    java = Course.query.filter_by(course_code='JAVA').first()
    dbms = Course.query.filter_by(course_code='DBMS').first()
    ai = Course.query.filter_by(course_code='AI').first()
    ids = Course.query.filter_by(course_code='IDS').first()
    dlco = Course.query.filter_by(course_code='DLCO').first()
    adbms = Course.query.filter_by(course_code='ADBMS').first()

    # Seed Branch Course mappings (EXACT SPECIFICATION RE-SEED)
    # Clear existing mappings to fix branch assignment
    BranchCourse.query.delete()
    db.session.commit()

    print("Re-seeding exact branch course mappings...")
    # Common core: DMGT, UHV, ADS, JAVA
    common = [dmgt, uhv, ads, java]
    
    # 1. AIDS: Common + DBMS (DMGT, UHV, ADS, JAVA, DBMS)
    for c in common + [dbms]:
        db.session.add(BranchCourse(branch_id=aids.id, course_id=c.id, semester=1))
        
    # 2. CSM: Common + AI (DMGT, UHV, ADS, JAVA, AI)
    for c in common + [ai]:
        db.session.add(BranchCourse(branch_id=csm.id, course_id=c.id, semester=1))

    # 3. CSD: Common + IDS (DMGT, UHV, ADS, JAVA, IDS)
    for c in common + [ids]:
        db.session.add(BranchCourse(branch_id=csd.id, course_id=c.id, semester=1))

    # 4. CAI: Common + AI (DMGT, UHV, ADS, JAVA, AI)
    for c in common + [ai]:
        db.session.add(BranchCourse(branch_id=cai.id, course_id=c.id, semester=1))

    # 5. CSC: Common + DLCO (DMGT, UHV, ADS, JAVA, DLCO)
    for c in common + [dlco]:
        db.session.add(BranchCourse(branch_id=csc.id, course_id=c.id, semester=1))

    db.session.commit()

    # Seed Prerequisites
    if Prerequisite.query.count() == 0:
        print("Seeding prerequisites...")
        prereq_adbms = Prerequisite(
            course_id=adbms.id, 
            required_course_id=dbms.id, 
            description='DBMS prerequisite is required before registering for Advanced DBMS.',
            status='ACTIVE'
        )
        db.session.add(prereq_adbms)
        db.session.commit()

    # Seed Classrooms
    if Classroom.query.count() == 0:
        print("Seeding classrooms...")
        r1 = Classroom(room_number='LH-101', building='Academic Block A', capacity=60, status='AVAILABLE')
        r2 = Classroom(room_number='LH-102', building='Academic Block A', capacity=60, status='AVAILABLE')
        r3 = Classroom(room_number='LAB-201', building='Technology Block B', capacity=40, status='AVAILABLE')
        r4 = Classroom(room_number='LAB-202', building='Technology Block B', capacity=40, status='AVAILABLE')
        db.session.add_all([r1, r2, r3, r4])
        db.session.commit()

    # Seed Users (Admin, Faculty, Students)
    if User.query.count() == 0:
        print("Seeding user accounts...")
        # 1. Admin User
        admin_user = User(username='admin', email='admin@college.edu', role='ADMIN')
        admin_user.set_password('admin123')
        db.session.add(admin_user)

        # 2. Faculty Users
        f1_user = User(username='prof_smith', email='smith@college.edu', role='FACULTY')
        f1_user.set_password('faculty123')
        
        f2_user = User(username='prof_johnson', email='johnson@college.edu', role='FACULTY')
        f2_user.set_password('faculty123')

        f3_user = User(username='prof_sharma', email='sharma@college.edu', role='FACULTY')
        f3_user.set_password('faculty123')

        db.session.add_all([f1_user, f2_user, f3_user])
        db.session.commit()

        # Faculty Profiles
        f1 = Faculty(user_id=f1_user.id, faculty_code='FAC-101', name='Dr. Smith', email='smith@college.edu', department='Computer Science')
        f2 = Faculty(user_id=f2_user.id, faculty_code='FAC-102', name='Dr. Johnson', email='johnson@college.edu', department='Data Science')
        f3 = Faculty(user_id=f3_user.id, faculty_code='FAC-103', name='Prof. Sharma', email='sharma@college.edu', department='Artificial Intelligence')
        db.session.add_all([f1, f2, f3])
        db.session.commit()

        # 3. Student Users (One for each branch)
        students_data = [
            ('22AIDS01', 'Rahul Verma', 'rahul.aids@student.edu', aids.id, 'student123'),
            ('22CSM01', 'Ananya Roy', 'ananya.csm@student.edu', csm.id, 'student123'),
            ('22CSD01', 'Vikram Singh', 'vikram.csd@student.edu', csd.id, 'student123'),
            ('22CAI01', 'Priya Patel', 'priya.cai@student.edu', cai.id, 'student123'),
            ('22CSC01', 'Karthik Raja', 'karthik.csc@student.edu', csc.id, 'student123'),
        ]

        for roll, name, email, b_id, pwd in students_data:
            s_user = User(username=roll.lower(), email=email, role='STUDENT')
            s_user.set_password(pwd)
            db.session.add(s_user)
            db.session.commit()

            st = Student(
                user_id=s_user.id,
                roll_number=roll,
                name=name,
                email=email,
                branch_id=b_id,
                year=2,
                semester=1,
                max_credits=24,
                status='ACTIVE'
            )
            db.session.add(st)
        db.session.commit()

    # Seed Timetable Slots
    if Timetable.query.count() == 0:
        print("Seeding timetable schedule slots...")
        r1 = Classroom.query.filter_by(room_number='LH-101').first()
        r2 = Classroom.query.filter_by(room_number='LH-102').first()
        r3 = Classroom.query.filter_by(room_number='LAB-201').first()

        f1 = Faculty.query.filter_by(faculty_code='FAC-101').first()
        f2 = Faculty.query.filter_by(faculty_code='FAC-102').first()
        f3 = Faculty.query.filter_by(faculty_code='FAC-103').first()

        slots = [
            # Monday slots for AIDS branch
            (dmgt.id, aids.id, f1.id, r1.id, 'Monday', '09:00', '10:30'),
            (java.id, aids.id, f2.id, r2.id, 'Monday', '10:30', '12:00'),
            (dbms.id, aids.id, f3.id, r3.id, 'Monday', '13:30', '15:00'),
            (ads.id, aids.id, f1.id, r1.id, 'Monday', '15:00', '16:30'),

            # Tuesday slots for AIDS branch
            (uhv.id, aids.id, f2.id, r2.id, 'Tuesday', '09:00', '10:30'),
            (dbms.id, aids.id, f3.id, r3.id, 'Tuesday', '10:30', '12:00'),

            # Wednesday slots for CAI & CSM branch (AI Fundamentals)
            (ai.id, cai.id, f3.id, r1.id, 'Wednesday', '09:00', '10:30'),
            (java.id, cai.id, f2.id, r2.id, 'Wednesday', '10:30', '12:00'),
            (ai.id, csm.id, f3.id, r1.id, 'Wednesday', '13:30', '15:00'),
        ]

        for c_id, b_id, f_id, r_id, day, start, end in slots:
            tt = Timetable(
                course_id=c_id,
                branch_id=b_id,
                faculty_id=f_id,
                classroom_id=r_id,
                day=day,
                start_time=start,
                end_time=end
            )
            db.session.add(tt)
        db.session.commit()

    # Seed Academic Settings
    if AcademicSetting.query.count() == 0:
        print("Seeding academic settings...")
        db.session.add_all([
            AcademicSetting(setting_key='current_academic_year', setting_value='2'),
            AcademicSetting(setting_key='current_semester', setting_value='1'),
            AcademicSetting(setting_key='max_credit_limit', setting_value='24'),
            AcademicSetting(setting_key='college_start_time', setting_value='09:00'),
            AcademicSetting(setting_key='college_end_time', setting_value='16:30')
        ])
        db.session.commit()

    # Pre-register Rahul Verma (AIDS) for DMGT & UHV
    rahul = Student.query.filter_by(roll_number='22AIDS01').first()
    if rahul and Registration.query.filter_by(student_id=rahul.id).count() == 0:
        reg1 = Registration(student_id=rahul.id, course_id=dmgt.id, status='REGISTERED')
        reg2 = Registration(student_id=rahul.id, course_id=uhv.id, status='REGISTERED')
        db.session.add_all([reg1, reg2])
        db.session.commit()

    print("Database seeding completed successfully.")
