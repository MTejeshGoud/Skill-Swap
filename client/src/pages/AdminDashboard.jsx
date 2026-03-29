import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, approveTrainer, logoutUser, getCurrentUser } from '../services/userService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'videos', 'fees', 'reports'

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'Admin') {
            navigate('/login');
            return;
        }
        refreshUsers();
    }, [navigate]);

    const refreshUsers = () => {
        setUsers(getUsers());
    };

    const handleApprove = (userId) => {
        if (approveTrainer(userId)) {
            refreshUsers();
            alert('Trainer approved successfully!');
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const pendingTrainers = users.filter(u => u.role === 'Trainer' && !u.isApproved);
    const activeUsers = users.filter(u => (u.role === 'Trainee' || (u.role === 'Trainer' && u.isApproved)));

    return (
        <div>
            <div className="p-4" style={{ background: 'white', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <button className="btn" style={{ padding: '0.5rem 1rem', background: '#fee2e2', color: '#ef4444' }} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                    {['users', 'videos', 'fees', 'reports'].map(tab => {
                        const labels = {
                            users: 'Manage Users', videos: 'Approve Videos', fees: 'Set Course Fees', reports: 'Payment Reports'
                        };
                        return (
                            <button
                                key={tab}
                                className={`btn ${activeTab === tab ? 'btn-primary' : ''}`}
                                style={{ 
                                    padding: '0.75rem 1rem', 
                                    whiteSpace: 'nowrap', 
                                    borderRadius: '8px 8px 0 0', 
                                    background: activeTab === tab ? undefined : 'transparent', 
                                    color: activeTab === tab ? undefined : 'var(--text-muted)', 
                                    boxShadow: 'none',
                                    borderBottom: activeTab === tab ? '2px solid var(--primary-blue)' : 'none'
                                }}
                                onClick={() => setActiveTab(tab)}
                            >
                                {labels[tab]}
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'users' && (
                    <div className="flex-col gap-6">
                        {/* Pending Approvals */}
                        <div>
                            <h2 className="font-bold text-lg mb-2" style={{ marginBottom: '1rem' }}>Pending Trainers ({pendingTrainers.length})</h2>
                            <div className="flex-col gap-4 animate-fade-in">
                                {pendingTrainers.length === 0 ? (
                                    <div className="text-center p-6 text-muted border" style={{ borderRadius: '8px', border: '1px dashed #ccc' }}>No pending trainer requests.</div>
                                ) : (
                                    pendingTrainers.map(user => (
                                        <div key={user.id} className="card">
                                            <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                                <div>
                                                    <h3 className="font-bold">{user.name}</h3>
                                                    <p className="text-sm text-muted">{user.email}</p>
                                                    {user.phone && <p className="text-sm text-muted">Phone: {user.phone}</p>}
                                                </div>
                                                <span className="text-xs font-semibold" style={{ background: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '4px' }}>
                                                    Pending
                                                </span>
                                            </div>

                                            <div style={{ marginBottom: '1rem' }}>
                                                <p className="text-sm font-semibold text-main">Qualifications:</p>
                                                <p className="text-sm text-muted" style={{ marginBottom: '0.5rem' }}>{user.qualifications || 'N/A'}</p>

                                                <p className="text-sm font-semibold text-main">Experience:</p>
                                                <p className="text-sm text-muted">{user.experience || 'N/A'}</p>
                                            </div>

                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleApprove(user.id)}
                                                style={{ background: 'var(--accent-green)', boxShadow: 'none' }}
                                            >
                                                Approve Trainer
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

                        {/* Active Users */}
                        <div>
                            <h2 className="font-bold text-lg mb-2" style={{ marginBottom: '1rem' }}>Active Users ({activeUsers.length})</h2>
                            <div className="flex-col gap-4 animate-fade-in">
                                {activeUsers.length === 0 ? (
                                    <div className="text-center p-6 text-muted border" style={{ borderRadius: '8px', border: '1px dashed #ccc' }}>No active users found.</div>
                                ) : (
                                    activeUsers.map(user => (
                                        <div key={user.id} className="card flex-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div className="flex-row gap-4" style={{ alignItems: 'center' }}>
                                                <div style={{ width: 40, height: 40, background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-sm">{user.name}</h3>
                                                    <p className="text-xs text-muted">
                                                        {user.role} {user.phone ? ` • ${user.phone}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted">
                                                Active
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div className="text-center p-6 text-muted animate-fade-in card" style={{ padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📹</div>
                        <h2 className="font-bold text-lg text-main">Approve Uploaded Videos</h2>
                        <p>Trainer uploaded course materials will appear here for review.</p>
                    </div>
                )}

                {activeTab === 'fees' && (
                    <div className="text-center p-6 text-muted animate-fade-in card" style={{ padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                        <h2 className="font-bold text-lg text-main">Set Course Fees</h2>
                        <p>Configure pricing and commission rates for published courses.</p>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="text-center p-6 text-muted animate-fade-in card" style={{ padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                        <h2 className="font-bold text-lg text-main">Payment Reports</h2>
                        <p>View revenue, trainee enrollments, and trainer payouts here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
