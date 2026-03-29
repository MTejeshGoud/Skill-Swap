
const USERS_KEY = 'skillswap_users_v2';
const CURRENT_USER_KEY = 'skillswap_current_user';

// Initialize Admin on load if not exists
const initializeAdmin = () => {
    const users = getUsers();
    const adminExists = users.some(u => u.role === 'Admin');

    if (!adminExists) {
        const adminUser = {
            id: 'admin-001',
            name: 'System Admin',
            email: 'admin@skillswap.com',
            password: 'admin', // Simple password for demo
            role: 'Admin',
            isApproved: true
        };
        users.push(adminUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        console.log('Admin initialized');
    }
};

export const getUsers = () => {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
};

export const registerUser = (userData) => {
    const users = getUsers();

    if (users.some(u => u.email === userData.email)) {
        throw new Error('User already exists with this email');
    }

    const newUser = {
        id: Date.now().toString(),
        ...userData,
        isApproved: userData.role === 'Trainee' ? true : false, // Trainers need approval
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
};

export const loginUser = (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (user.role === 'Trainer' && !user.isApproved) {
        throw new Error('Your account is pending approval from Admin.');
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
};

export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
};

export const approveTrainer = (userId) => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === userId);

    if (index !== -1) {
        users[index].isApproved = true;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return true;
    }
    return false;
};

// Auto-initialize admin when this module is imported/used
initializeAdmin();
