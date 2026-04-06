import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('Trainee');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        console.log('Attempting login:', { email, role });

        try {
            const user = await loginUser(email, password);
            console.log('User found:', user);

            if (user.role !== role) {
                // If the user registered as a different role, tell them which one
                setError(`This account is registered as a "${user.role}", but you are trying to login as a "${role}". Please switch tabs.`);
                return;
            }

            if (user.role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || "Login failed");
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
                    <p className="text-muted">Login to continue your journey</p>
                </div>

                <div className="role-selector">
                    {['Trainee', 'Trainer', 'Admin'].map((r) => (
                        <div
                            key={r}
                            className={`role-btn ${role === r ? 'active' : ''}`}
                            onClick={() => setRole(r)}
                        >
                            {r}
                        </div>
                    ))}
                </div>

                {error && <div className="p-4" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', background: '#fee2e2', borderRadius: '8px' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-right" style={{ marginBottom: '1.5rem' }}>
                        <a href="#" className="text-sm text-primary" style={{ textDecoration: 'none' }}>Forgot Password?</a>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Login as {role}
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '1.5rem' }}>
                    <p className="text-muted text-sm">
                        Don't have an account?{' '}
                        <span
                            onClick={() => navigate('/register')}
                            className="text-primary font-semibold"
                            style={{ cursor: 'pointer' }}
                        >
                            Sign up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
