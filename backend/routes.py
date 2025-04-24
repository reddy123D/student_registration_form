from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Student, Parent
import os

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://username:password@localhost/student_db"
app.config['UPLOAD_FOLDER'] = 'static'

db.init_app(app)

@app.route('/register-student', methods=['POST'])
def register_student():
    data = request.form
    photo = request.files.get('student_photo')
    photo_path = os.path.join(app.config['UPLOAD_FOLDER'], photo.filename)
    photo.save(photo_path)

    student = Student(
        first_name=data['first_name'],
        last_name=data['last_name'],
        dob=data['dob'],
        student_class=data['student_class'],
        student_photo=photo.filename,
        aadhar=data['aadhar']
    )
    db.session.add(student)
    db.session.commit()

    parent = Parent(
        student_id=student.id,
        father_name=data['father_name'],
        mother_name=data['mother_name'],
        phone=data['phone'],
        email=data['email']
    )
    db.session.add(parent)
    db.session.commit()

    return jsonify({"message": "Student registered successfully"}), 201

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
