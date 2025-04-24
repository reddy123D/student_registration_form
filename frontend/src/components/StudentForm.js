// src/components/StudentForm.js
import React, { useState } from "react";
import "../App.css";

const StudentForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleNext = () => {
    // Validate Student Details before moving to Parent Details
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dob ||
      !formData.gender ||
      !formData.address ||
      !formData.studentClass ||
      !formData.aadhar ||
      !formData.photo
    ) {
      setMessage("⚠️ Please fill all Student Details before proceeding!");
      return;
    }
    setMessage("");
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate Parent Details before submission
    if (
      !formData.fatherName ||
      !formData.motherName ||
      !formData.parentMobile ||
      !formData.parentEmail
    ) {
      setMessage("⚠️ Please fill all Parent Details before submitting!");
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Student Registered Successfully!");
        setFormData({
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
        setStep(1);
      } else {
        setMessage("❌ " + (result.error || "Registration Failed!"));
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("⚠️ A network error occurred. Please check the backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Student Registration Form</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {step === 1 && (
          <>
            <h3>Student Details</h3>
            <div className="form-group">
              <label>First Name:</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Date of Birth:</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Gender:</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Address:</label>
              <textarea name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Class:</label>
              <input type="text" name="studentClass" value={formData.studentClass} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Upload Aadhar:</label>
              <input type="file" name="aadhar" accept=".pdf,.jpg,.png" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Upload Photo:</label>
              <input type="file" name="photo" accept="image/*" onChange={handleChange} required />
            </div>

            <div className="button-group">
              <button type="button" className="btn next-btn" onClick={handleNext}>Next</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Parent Details</h3>
            <div className="form-group">
              <label>Father's Name:</label>
              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Mother's Name:</label>
              <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Parent Mobile Number:</label>
              <input type="tel" name="parentMobile" value={formData.parentMobile} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Parent Email ID:</label>
              <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} required />
            </div>

            <div className="button-group">
              <button type="button" className="btn back-btn" onClick={handleBack}>Back</button>
              <button type="submit" className="btn submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </form>

      {message && <div className="message-box">{message}</div>}
    </div>
  );
};

export default StudentForm;
