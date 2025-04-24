import React, { useState } from 'react';

const StudentRegistrationForm = () => {
  const [studentData, setStudentData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    address: '',
    student_class: '',
    father_name: '',
    mother_name: '',
    mobile_number: '',
    email: '',
    aadhar_upload: null,  // to store the file
    student_photo: null,  // to store the file
  });

  const [message, setMessage] = useState("");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setStudentData({
      ...studentData,
      [name]: files[0],  // Save the first file selected
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data for file upload
    const formData = new FormData();
    for (const key in studentData) {
      if (studentData[key]) {
        formData.append(key, studentData[key]);
      }
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        body: formData,  // Send the form data as is
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);  // Display success message
      } else {
        setMessage(result.error);  // Display error message
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    }
  };

  return (
    <div>
      <h1>Student Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={studentData.first_name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={studentData.last_name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={studentData.dob}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Gender:
          <input
            type="text"
            name="gender"
            value={studentData.gender}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={studentData.address}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Class:
          <input
            type="text"
            name="student_class"
            value={studentData.student_class}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Aadhar Upload:
          <input
            type="file"
            name="aadhar_upload"
            onChange={handleFileChange}
          />
        </label>
        <br />
        <label>
          Student Photo:
          <input
            type="file"
            name="student_photo"
            onChange={handleFileChange}
          />
        </label>
        <br />
        <label>
          Father's Name:
          <input
            type="text"
            name="father_name"
            value={studentData.father_name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Mother's Name:
          <input
            type="text"
            name="mother_name"
            value={studentData.mother_name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Mobile Number:
          <input
            type="text"
            name="mobile_number"
            value={studentData.mobile_number}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={studentData.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Register Student</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default StudentRegistrationForm;
