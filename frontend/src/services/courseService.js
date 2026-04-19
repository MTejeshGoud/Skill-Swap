const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
    };
};

// Gets all courses authorized for the user
export const getCourses = async () => {
    const res = await fetch(`${API_URL}/courses/all`, { headers: getHeaders(), credentials: 'include' });
    if (!res.ok) return [];
    return await res.json();
};

// Save newly drafted or pending courses
export const saveCourse = async (courseData) => {
    const isUpdate = courseData.id || courseData._id;
    const url = isUpdate ? `${API_URL}/courses/${courseData.id || courseData._id}` : `${API_URL}/courses`;
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method: method,
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(courseData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save course');
    return data;
};

// Fetch courses for the public facing pages
export const getApprovedCourses = async () => {
    const res = await fetch(`${API_URL}/courses/approved`, { headers: getHeaders(), credentials: 'include' });
    if (!res.ok) return [];
    return await res.json();
};

// Update status (Approve or Reject)
export const updateCourseStatus = async (courseId, status, additionalData = {}) => {
    const res = await fetch(`${API_URL}/courses/${courseId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ status, ...additionalData })
    });
    return res.ok;
};

export const getCoursesForTrainer = async (trainerId) => {
    const res = await fetch(`${API_URL}/courses/trainer`, { headers: getHeaders(), credentials: 'include' });
    if (!res.ok) return [];
    return await res.json();
};

export const getPendingCourses = async () => {
    const courses = await getCourses();
    return courses.filter(c => c.status === 'pending');
};
