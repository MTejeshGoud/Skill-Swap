import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/userService';

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('Trainee');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        qualifications: '',
        experience: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const user = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: role.toLowerCase(),
                // Only include these if trainer
                ...(role === 'Trainer' && {
                    qualifications: formData.qualifications,
                    experience: formData.experience
                })
            };

            await registerUser(user);

            if (role === 'Trainer') {
                alert('Registration successful! Please wait for Admin approval before logging in.');
                navigate('/login');
            } else {
                alert('Registration successful! Please login.');
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <h1 className="text-2xl font-bold text-primary">Create Account</h1>
                    <p className="text-muted">Join the community today</p>
                </div>

                <div className="role-selector">
                    {['Trainee', 'Trainer'].map((r) => (
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

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {role === 'Trainer' && (
                        <>
                            <div className="form-group animate-fade-in">
                                <label className="form-label">Qualifications</label>
                                <input
                                    type="text"
                                    name="qualifications"
                                    className="form-input"
                                    placeholder="e.g. Certified Yoga Instructor, PhD in CS"
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group animate-fade-in">
                                <label className="form-label">Work Experience</label>
                                <textarea
                                    name="experience"
                                    className="form-input"
                                    placeholder="Briefly describe your experience..."
                                    value={formData.experience}
                                    onChange={handleChange}
                                    rows={3}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Sign Up as {role}
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '1.5rem' }}>
                    <p className="text-muted text-sm">
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            className="text-primary font-semibold"
                            style={{ cursor: 'pointer' }}
                        >
                            Log in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
