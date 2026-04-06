const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('skillswap_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// Gets all courses authorized for the user
export const getCourses = async () => {
    const res = await fetch(`${API_URL}/courses`, { headers: getHeaders() });
    if (!res.ok) return [];
    return await res.json();
};

// Save newly drafted or pending courses
export const saveCourse = async (courseData) => {
    const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(courseData)
    });
    if (!res.ok) throw new Error('Failed to save course');
    return await res.json();
};

// Fetch courses for the public facing pages
export const getApprovedCourses = async () => {
    const res = await fetch(`${API_URL}/courses/public`);
    if (!res.ok) return [];
    return await res.json();
};

// Update status (Approve or Reject)
export const updateCourseStatus = async (courseId, status, additionalData = {}) => {
    const res = await fetch(`${API_URL}/courses/${courseId}/approve`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, ...additionalData })
    });
    return res.ok;
};

// Compatability stubs
export const getCoursesForTrainer = async (trainerId) => {
    return await getCourses(); // Handled server-side automatically
};

export const getPendingCourses = async () => {
    const courses = await getCourses();
    return courses.filter(c => c.status === 'pending');
};
