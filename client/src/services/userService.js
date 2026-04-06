const API_URL = 'http://localhost:5000/api';
const CURRENT_USER_KEY = 'skillswap_current_user';
const TOKEN_KEY = 'skillswap_token';

const getHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const registerUser = async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
    return data.user;
};

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
    return data.user;
};

export const logoutUser = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
};

export const getUsers = async () => {
    const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
    if (!res.ok) return [];
    return await res.json();
};

export const setTrainerFeePaid = async (userId, feePaidStatus) => {
    const res = await fetch(`${API_URL}/users/${userId}/fee`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ fee_paid: feePaidStatus })
    });
    return res.ok;
};

// Auto approval logic is handled manually now via setTrainerFeePaid, dummy for compatibility
export const approveTrainer = async (userId) => {
    return await setTrainerFeePaid(userId, true);
};
