const API_URL = 'http://localhost:5000/api';
// We no longer touch localStorage for the JWT! It is securely baked into HTTP cookies by the browser.

const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
    };
};

// Check if currently authenticated securely
export const getCurrentUser = async () => {
    try {
        const res = await fetch(`${API_URL}/auth/me`, { 
            headers: getHeaders(), 
            credentials: 'include' 
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user;
    } catch {
        return null;
    }
};

export const registerUser = async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data.user;
};

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data.user;
};

export const logoutUser = async () => {
    try {
        await fetch(`${API_URL}/auth/logout`, { 
            method: 'POST', 
            credentials: 'include' 
        });
    } catch (e) {
        console.error("Logout issue: ", e);
    }
};

export const getUsers = async () => {
    const res = await fetch(`${API_URL}/users`, { headers: getHeaders(), credentials: 'include' });
    if (!res.ok) return [];
    return await res.json();
};

export const setTrainerFeePaid = async (userId, feePaidStatus) => {
    const res = await fetch(`${API_URL}/users/${userId}/fee`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ feePaidStatus })
    });
    return res.ok;
};

// Auto approval logic for backwards capability
export const approveTrainer = async (userId) => {
    const res = await fetch(`${API_URL}/users/${userId}/approve`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include'
    });
    return res.ok;
};
