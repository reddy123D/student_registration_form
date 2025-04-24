import React, { useState } from "react";
import StudentList from "./components/StudentList"; // Import Student List
import "./App.css";

function App() {
  const [step, setStep] = useState(1); // Track form step
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [message, setMessage] = useState(""); // Track success or error messages

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    address: "",
    studentClass: "",
    aadhar: null,
    photo: null,
    fatherName: "",
    motherName: "",
    parentMobile: "",
    parentEmail: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files.length > 0 ? files[0] : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const validateFormData = () => {
    const requiredFields = [
      "firstName", "lastName", "dob", "gender", "address", "studentClass",
      "aadhar", "photo", "fatherName", "motherName", "parentMobile", "parentEmail"
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setMessage(`❌ ${field} is required!`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions

    // Validate form data before submission
    if (!validateFormData()) return;

    setIsSubmitting(true); // Set submission state to true to disable button
    const API_URL = "http://127.0.0.1:5000/register";
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok) {
        setMessage("✅ Student Registered Successfully!");
      } else {
        setMessage("❌ " + (result.error || "Registration Failed! Please try again."));
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("⚠️ A network error occurred. Please check the backend and try again.");
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <div className="video-container">
      <video autoPlay loop muted className="background-video">
        <source
          src="https://media.istockphoto.com/id/976740068/video/chat-icon-on-abstract-blue-background.mp4?s=mp4-640x640-is&k=20&c=bmXWym55JH3b7KKNwjXznhFgaIXftL7krTfAlvuNHLI="
          type="video/mp4"
        />
      </video>

      <div className="form-container">
        <h2>Student Registration Form</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {step === 1 && (
            <>
              <h3>Student Details</h3>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address:</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Class:</label>
                <input
                  type="text"
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload Student Aadhar:</label>
                <input
                  type="file"
                  name="aadhar"
                  accept=".pdf,.jpg,.png"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload Student Photo:</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="button-group">
                <button type="button" className="btn next-btn" onClick={handleNext}>
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3>Parent Details</h3>
              <div className="form-group">
                <label>Father's Name:</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mother's Name:</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Parent Mobile Number:</label>
                <input
                  type="tel"
                  name="parentMobile"
                  value={formData.parentMobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Parent Email ID:</label>
                <input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="button-group">
                <button type="button" className="btn back-btn" onClick={handleBack}>
                  Back
                </button>
                <button
                  type="submit"
                  className="btn submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Display success/error message */}
        {message && <div className="message-box">{message}</div>}
      </div>

      {/* Student List Component */}
      <div className="student-list-container">
        <h2>Registered Students</h2>
        <StudentList />
      </div>
    </div>
  );
}

export default App;
