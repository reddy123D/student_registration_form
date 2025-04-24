from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import psycopg2


# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Enable CORS for frontend connection
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# PostgreSQL Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:123456789@localhost/student_registration')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')

# Configure upload folder and allowed file extensions
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'png', 'jpeg', 'pdf'}

# Check if upload folder exists, if not, create it
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Initialize database
db = SQLAlchemy(app)
migrate = Migrate(app, db)  # Enable Flask-Migrate

# ✅ **Student Model**
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    address = db.Column(db.Text, nullable=False)
    student_class = db.Column(db.String(50), nullable=False)
    aadhar_upload = db.Column(db.String(255), nullable=True)  # File upload path
    student_photo = db.Column(db.String(255), nullable=True)  # File upload path
    father_name = db.Column(db.String(100), nullable=False)
    mother_name = db.Column(db.String(100), nullable=False)
    mobile_number = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# ✅ **Register a Student**
@app.route('/register', methods=['POST'])
def register_student():
    try:
        # Retrieve form fields
        first_name = request.form.get('firstName')
        last_name = request.form.get('lastName')
        dob = request.form.get('dob')
        gender = request.form.get('gender')
        address = request.form.get('address')
        student_class = request.form.get('studentClass')
        father_name = request.form.get('fatherName')
        mother_name = request.form.get('motherName')
        parent_mobile = request.form.get('parentMobile')
        parent_email = request.form.get('parentEmail')

        # Handle file uploads
        aadhar_file = request.files.get('aadhar')
        photo_file = request.files.get('photo')

        # Process the Aadhar file if it exists
        if aadhar_file and allowed_file(aadhar_file.filename):
            aadhar_filename = secure_filename(aadhar_file.filename)
            aadhar_file.save(os.path.join(app.config['UPLOAD_FOLDER'], aadhar_filename))
        else:
            aadhar_filename = None  # No file or invalid file

        # Process the photo file if it exists
        if photo_file and allowed_file(photo_file.filename):
            photo_filename = secure_filename(photo_file.filename)
            photo_file.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_filename))
        else:
            photo_filename = None  # No file or invalid file

        # Check if student with the given email already exists
        existing_student = Student.query.filter_by(email=parent_email).first()

        if existing_student:
            # Update existing student's details if email already exists
            existing_student.first_name = first_name
            existing_student.last_name = last_name
            existing_student.dob = dob
            existing_student.gender = gender
            existing_student.address = address
            existing_student.student_class = student_class
            existing_student.aadhar_upload = aadhar_filename
            existing_student.student_photo = photo_filename
            existing_student.father_name = father_name
            existing_student.mother_name = mother_name
            existing_student.mobile_number = parent_mobile

            db.session.commit()
            return jsonify({"message": "Student details updated successfully!"}), 200

        # Register as a new student
        new_student = Student(
            first_name=first_name,
            last_name=last_name,
            dob=dob,
            gender=gender,
            address=address,
            student_class=student_class,
            aadhar_upload=aadhar_filename,
            student_photo=photo_filename,
            father_name=father_name,
            mother_name=mother_name,
            mobile_number=parent_mobile,
            email=parent_email
        )

        db.session.add(new_student)
        db.session.commit()

        return jsonify({"message": "Student registered successfully!"}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ✅ **Fetch All Students**
@app.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    student_list = [
        {
            "id": s.id, "first_name": s.first_name, "last_name": s.last_name,
            "dob": str(s.dob), "gender": s.gender, "address": s.address, "student_class": s.student_class,
            "aadhar_upload": s.aadhar_upload, "student_photo": s.student_photo,
            "father_name": s.father_name, "mother_name": s.mother_name,
            "mobile_number": s.mobile_number, "email": s.email
        }
        for s in students
    ]
    return jsonify({"students": student_list})

@app.route('/students/delete', methods=['DELETE'])
def delete_student():
    try:
        data = request.get_json()
        student_id = data.get('id')

        if not student_id:
            return jsonify({'error': 'Student ID is required'}), 400

        student = Student.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404

        db.session.delete(student)
        db.session.commit()

        return jsonify({'message': 'Student deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

import psycopg2  # Already needed for this part

@app.route('/students/<int:student_id>', methods=['PATCH'])
def update_partial_data(student_id):
    try:
        data = request.get_json()

        # Connect to the PostgreSQL database directly
        conn = psycopg2.connect(
            dbname="student_registration",
            user="postgres",
            password="123456789",  # Update based on your actual password
            host="localhost",
            port="5432"
        )
        cur = conn.cursor()

        # Build the SQL query dynamically
        set_clauses = []
        values = []
        for key, value in data.items():
            set_clauses.append(f"{key} = %s")
            values.append(value)

        if not set_clauses:
            return jsonify({"error": "No fields provided for update"}), 400

        values.append(student_id)  # Add student_id as the last value for WHERE clause

        query = f"UPDATE student SET {', '.join(set_clauses)} WHERE id = %s"
        cur.execute(query, tuple(values))
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"message": "Student data updated via psycopg2 successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/students/view')
def view_students():
    students = Student.query.all()
    html = "<h2>Registered Students</h2><ul>"
    for s in students:
        html += f"<li>{s.id} - {s.first_name} {s.last_name} ({s.email})</li>"
    html += "</ul>"
    return html


# ✅ **Home Route**
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Student Registration API!"})

# ✅ **Initialize Database**
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure tables are created
    app.run(debug=True)
