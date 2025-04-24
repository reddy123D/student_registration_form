import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                if (!token) {
                    console.error("No authorization token found");
                    return;
                }

                const response = await axios.get('http://127.0.0.1:5000/admin/students', {
                    headers: {
                        Authorization: `Bearer ${token}`  // Send token in headers
                    }
                });

                setStudents(response.data.students);
            } catch (error) {
                console.error("Error fetching students:", error.response?.data || error.message);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div>
            <h2>Student List</h2>
            <ul>
                {students.map(student => (
                    <li key={student.id}>{student.first_name} {student.last_name}</li>
                ))}
            </ul>
        </div>
    );
};

export default StudentList;
