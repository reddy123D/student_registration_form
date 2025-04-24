import React, { useState, useEffect } from "react";
import "../App.css"; // Ensure styling consistency

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setError(null);
      const response = await fetch("http://127.0.0.1:5000/students");
      if (!response.ok) throw new Error("Failed to fetch students.");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Unable to fetch student records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    setDeleting(id);
    try {
      const response = await fetch(`http://127.0.0.1:5000/students/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete student.");

      setStudents(students.filter((student) => student.id !== id));
      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Class</th>
              <th>Parent Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id || "N/A"}</td>
                  <td>{`${student.firstName || "Unknown"} ${student.lastName || ""}`}</td>
                  <td>{student.dob || "Not Provided"}</td>
                  <td>{student.studentClass || "N/A"}</td>
                  <td>{student.parentMobile || "N/A"}</td>
                  <td>
                    <button
                      className="btn delete-btn"
                      onClick={() => deleteStudent(student.id)}
                      disabled={deleting === student.id}
                    >
                      {deleting === student.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No students found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
