from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    dob = db.Column(db.Date, nullable=False)  # Changed to Date for proper date storage
    gender = db.Column(db.String(10), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    student_class = db.Column(db.String(10), nullable=False)
    aadhar = db.Column(db.String(255), nullable=True)  # Made optional
    photo = db.Column(db.String(255), nullable=True)  # Made optional
    father_name = db.Column(db.String(50), nullable=False)
    mother_name = db.Column(db.String(50), nullable=False)
    parent_mobile = db.Column(db.String(15), nullable=False)
    parent_email = db.Column(db.String(100), nullable=False)

    def __init__(self, first_name, last_name, dob, gender, address, student_class, aadhar=None, photo=None, father_name=None, mother_name=None, parent_mobile=None, parent_email=None):
        self.first_name = first_name
        self.last_name = last_name
        self.dob = datetime.strptime(dob, "%Y-%m-%d") if isinstance(dob, str) else dob
        self.gender = gender
        self.address = address
        self.student_class = student_class
        self.aadhar = aadhar
        self.photo = photo
        self.father_name = father_name
        self.mother_name = mother_name
        self.parent_mobile = parent_mobile
        self.parent_email = parent_email


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Added timestamp for creation time
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Added timestamp for updates

    def __init__(self, username, password_hash):
        self.username = username
        self.password_hash = password_hash
