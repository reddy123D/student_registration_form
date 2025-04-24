const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";  // Use .env or fallback

// Register Student API
export async function registerStudent(studentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to register student:", error);
        return { success: false, message: error.message };
    }
}

// Fetch All Students API
export async function fetchStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch students:", error);
        return { success: false, message: error.message };
    }
}
