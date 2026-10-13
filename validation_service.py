from app.models.models import (
    db, Student, Course, BranchCourse, Prerequisite, 
    Registration, Grade, Timetable, Classroom, Faculty
)

def time_to_minutes(time_str):
    """Helper to convert HH:MM string to total minutes for comparison."""
    try:
        parts = time_str.strip().split(':')
        return int(parts[0]) * 60 + int(parts[1])
    except Exception:
        return 0

def check_time_overlap(start1, end1, start2, end2):
    """
    Overlap logic:
    New Start < Existing End AND New End > Existing Start
    """
    s1 = time_to_minutes(start1)
    e1 = time_to_minutes(end1)
    s2 = time_to_minutes(start2)
    e2 = time_to_minutes(end2)
    
    return (s1 < e2) and (e1 > s2)

class RegistrationValidationService:

    @staticmethod
    def validate_course_registration(student_id, course_id):
        """
        Executes complete multi-level registration validation pipeline.
        Returns: tuple (is_valid: bool, error_message: str, details: dict)
        """
        # 1. Student Authentication & Status
        student = Student.query.get(student_id)
        if not student:
            return False, "Registration Failed: Student record not found.", {}
        if student.status != 'ACTIVE':
            return False, "Registration Failed: Student account is inactive.", {}

        # 2. Course Existence
        course = Course.query.get(course_id)
        if not course:
            return False, "Registration Failed: Requested course does not exist.", {}

        # 3. Course Active Status
        if course.status != 'ACTIVE':
            return False, f"Registration Failed: Course '{course.course_name}' is currently inactive.", {}

        # 4. Branch Eligibility
        branch_mapping = BranchCourse.query.filter_by(
            branch_id=student.branch_id, 
            course_id=course.id
        ).first()
        if not branch_mapping:
            return False, f"Registration Failed: Course '{course.course_name}' ({course.course_code}) is not offered for your branch ({student.branch.branch_code}).", {}

        # 5. Year and Semester Eligibility
        if course.year != student.year or course.semester != student.semester:
            return False, f"Registration Failed: Course is for Year {course.year} Sem {course.semester}, but you are in Year {student.year} Sem {student.semester}.", {}

        # 6. Duplicate Registration Check
        existing_reg = Registration.query.filter_by(
            student_id=student.id,
            course_id=course.id,
            status='REGISTERED'
        ).first()
        if existing_reg:
            return False, f"Registration Failed: You are already registered for '{course.course_name}'.", {}

        # 7. Prerequisite Satisfaction Check
        prereqs = Prerequisite.query.filter_by(course_id=course.id, status='ACTIVE').all()
        for prereq in prereqs:
            required_course = Course.query.get(prereq.required_course_id)
            req_code = required_course.course_code if required_course else 'Prerequisite'
            req_name = required_course.course_name if required_course else ''
            
            # Check if student has passed grade in prerequisite
            passed_grade = Grade.query.filter_by(
                student_id=student.id,
                course_id=prereq.required_course_id
            ).first()

            # Alternatively check if student registered for prerequisite previously
            prev_reg = Registration.query.filter_by(
                student_id=student.id,
                course_id=prereq.required_course_id,
                status='REGISTERED'
            ).first()

            if not passed_grade and not prev_reg:
                return False, f"Registration Failed: {req_code} ({req_name}) prerequisite is required before registering for {course.course_name}.", {
                    'prerequisite_missing': req_code
                }

        # 8. Course Capacity Check
        enrolled_count = Registration.query.filter_by(course_id=course.id, status='REGISTERED').count()
        if enrolled_count >= course.capacity:
            return False, f"Registration Failed: Course '{course.course_name}' is full. Capacity ({course.capacity}) reached.", {
                'capacity': course.capacity,
                'enrolled': enrolled_count
            }

        # 9. Credit Limit Check
        current_registrations = Registration.query.filter_by(student_id=student.id, status='REGISTERED').all()
        current_credits = sum([reg.course.credits for reg in current_registrations if reg.course])
        
        if (current_credits + course.credits) > student.max_credits:
            return False, f"Registration Failed: Maximum semester credit limit exceeded. Current: {current_credits} credits, Course: {course.credits} credits, Max Allowed: {student.max_credits} credits.", {
                'current_credits': current_credits,
                'new_credits': course.credits,
                'max_credits': student.max_credits
            }

        # 10. Student Timetable Clash Detection
        target_slots = Timetable.query.filter_by(course_id=course.id).all()
        
        # Get all timetable slots for student's currently registered courses
        registered_course_ids = [reg.course_id for reg in current_registrations]
        existing_slots = Timetable.query.filter(Timetable.course_id.in_(registered_course_ids)).all() if registered_course_ids else []

        for new_slot in target_slots:
            for old_slot in existing_slots:
                if new_slot.day.upper() == old_slot.day.upper():
                    if check_time_overlap(new_slot.start_time, new_slot.end_time, old_slot.start_time, old_slot.end_time):
                        existing_course = Course.query.get(old_slot.course_id)
                        conflicting_name = existing_course.course_name if existing_course else 'Existing Class'
                        return False, f"Registration Failed: Timetable clash detected between {course.course_name} ({new_slot.day} {new_slot.start_time}–{new_slot.end_time}) and {conflicting_name} ({old_slot.day} {old_slot.start_time}–{old_slot.end_time}).", {
                            'conflicting_course': conflicting_name,
                            'day': new_slot.day,
                            'new_slot': f"{new_slot.start_time}-{new_slot.end_time}",
                            'old_slot': f"{old_slot.start_time}-{old_slot.end_time}"
                        }

        # All 10 validation stages passed successfully
        return True, "Validation successful. Course registration permitted.", {
            'student_id': student.id,
            'course_id': course.id,
            'course_credits': course.credits,
            'total_credits_after': current_credits + course.credits
        }


class TimetableConflictService:

    @staticmethod
    def validate_timetable_slot(course_id, branch_id, faculty_id, classroom_id, day, start_time, end_time, exclude_timetable_id=None):
        """
        Validates timetable creation/updates for:
        1. Faculty overlap
        2. Classroom overlap
        3. Branch overlap
        Returns: tuple (is_valid: bool, error_message: str)
        """
        # 1. Faculty Conflict Check
        query_faculty = Timetable.query.filter(
            Timetable.faculty_id == faculty_id,
            Timetable.day == day
        )
        if exclude_timetable_id:
            query_faculty = query_faculty.filter(Timetable.id != exclude_timetable_id)
            
        faculty_slots = query_faculty.all()
        for slot in faculty_slots:
            if check_time_overlap(start_time, end_time, slot.start_time, slot.end_time):
                faculty = Faculty.query.get(faculty_id)
                f_name = faculty.name if faculty else 'Faculty member'
                return False, f"Faculty Conflict: {f_name} is already assigned to teach {slot.course.course_code if slot.course else 'another class'} on {day} from {slot.start_time} to {slot.end_time}."

        # 2. Classroom Conflict Check
        query_room = Timetable.query.filter(
            Timetable.classroom_id == classroom_id,
            Timetable.day == day
        )
        if exclude_timetable_id:
            query_room = query_room.filter(Timetable.id != exclude_timetable_id)

        room_slots = query_room.all()
        for slot in room_slots:
            if check_time_overlap(start_time, end_time, slot.start_time, slot.end_time):
                room = Classroom.query.get(classroom_id)
                r_num = room.room_number if room else 'Classroom'
                return False, f"Classroom Conflict: {r_num} is already reserved for {slot.course.course_code if slot.course else 'another course'} on {day} from {slot.start_time} to {slot.end_time}."

        # 3. Branch Conflict Check (Branch cannot have 2 classes at same time)
        query_branch = Timetable.query.filter(
            Timetable.branch_id == branch_id,
            Timetable.day == day
        )
        if exclude_timetable_id:
            query_branch = query_branch.filter(Timetable.id != exclude_timetable_id)

        branch_slots = query_branch.all()
        for slot in branch_slots:
            if check_time_overlap(start_time, end_time, slot.start_time, slot.end_time):
                return False, f"Branch Timetable Conflict: This branch already has a class ({slot.course.course_code if slot.course else 'Course'}) scheduled on {day} from {slot.start_time} to {slot.end_time}."

        return True, "Timetable slot conflict-free."
