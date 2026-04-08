import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, approveTrainer, logoutUser, getCurrentUser, setTrainerFeePaid } from '../services/userService';
import { getCourses, updateCourseStatus } from '../services/courseService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'courses'
    const [coursePrices, setCoursePrices] = useState({});

    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = await getCurrentUser();
            if (!currentUser || currentUser.role !== 'admin') {
                navigate('/login');
                return;
            }
            refreshData();
        };
        checkAuth();
    }, [navigate]);

    const refreshData = async () => {
        const u = await getUsers();
        setUsers(u);
        const allCourses = await getCourses();
        setCourses(allCourses);
        // Initialize pricing states for pending courses
        const initialPrices = {};
        allCourses.filter(c => c.status === 'pending').forEach(c => {
            initialPrices[c.id] = c.trainer_price;
        });
        setCoursePrices(initialPrices);
    };

    const handleApproveTrainer = async (userId) => {
        await approveTrainer(userId);
        refreshData();
        alert('Trainer approved successfully!');
    };

    const handleToggleFeePaid = async (userId, currentStatus) => {
        await setTrainerFeePaid(userId, !currentStatus);
        refreshData();
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const handleApproveCourse = async (course) => {
        const finalPrice = coursePrices[course.id] || course.trainer_price;
        await updateCourseStatus(course.id, 'approved', { final_price: finalPrice });
        refreshData();
    };

    const handleRejectCourse = async (courseId) => {
        const reason = prompt("Enter reason for rejection:");
        if (reason !== null) {
            await updateCourseStatus(courseId, 'rejected', { rejection_reason: reason });
            refreshData();
        }
    };

    const pendingTrainers = users.filter(u => u.role === 'Trainer' && !u.isApproved);
    const activeUsers = users.filter(u => (u.role === 'Trainee' || (u.role === 'Trainer' && u.isApproved)));
    const pendingCourses = courses.filter(c => c.status === 'pending');

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
                    {['users', 'courses'].map(tab => {
                        const labels = { users: 'Manage Users', courses: 'Approve Courses' };
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
                    <div className="flex-col gap-6" style={{maxWidth: '800px', margin: '0 auto'}}>
                        {/* Pending Approvals */}
                        <div>
                            <h2 className="font-bold text-lg mb-2">Pending Trainers ({pendingTrainers.length})</h2>
                            <div className="flex-col gap-4 animate-fade-in">
                                {pendingTrainers.length === 0 ? (
                                    <div className="text-center p-6 text-muted border border-dashed rounded-lg">No pending trainer requests.</div>
                                ) : (
                                    pendingTrainers.map(user => (
                                        <div key={user.id} className="card">
                                            <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                                <div>
                                                    <h3 className="font-bold">{user.name}</h3>
                                                    <p className="text-sm text-muted">{user.email}</p>
                                                </div>
                                                <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Pending</span>
                                            </div>
                                            <button className="btn btn-primary bg-green-600" onClick={() => handleApproveTrainer(user.id)}>
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
                            <h2 className="font-bold text-lg mb-2">Active Users ({activeUsers.length})</h2>
                            <div className="flex-col gap-4 animate-fade-in">
                                {activeUsers.map(user => (
                                    <div key={user.id} className="card flex-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div className="flex-row gap-4" style={{ alignItems: 'center' }}>
                                            <div style={{ width: 40, height: 40, background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm">{user.name}</h3>
                                                <p className="text-xs text-muted">{user.role}</p>
                                            </div>
                                        </div>
                                        {user.role === 'Trainer' && (
                                            <div className="flex-row items-center gap-2">
                                                <span className="text-sm text-muted">Platform Fee Paid:</span>
                                                <button 
                                                    className={`btn ${user.fee_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', boxShadow: 'none' }}
                                                    onClick={() => handleToggleFeePaid(user.id, user.fee_paid)}
                                                >
                                                    {user.fee_paid ? 'Yes' : 'No (Mark as Paid)'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div style={{maxWidth: '800px', margin: '0 auto'}}>
                        <h2 className="font-bold text-lg mb-4">Pending Course Approvals ({pendingCourses.length})</h2>
                        <div className="flex-col gap-4 animate-fade-in">
                            {pendingCourses.length === 0 ? (
                                <div className="text-center p-6 text-muted border border-dashed rounded-lg">No pending courses.</div>
                            ) : (
                                pendingCourses.map(course => {
                                    const trainer = users.find(u => u.id === course.trainer_id);
                                    return (
                                        <div key={course.id} className="card">
                                            <div className="flex-row justify-between mb-2">
                                                <h3 className="font-bold text-lg">{course.title}</h3>
                                                <span className="text-sm text-muted">By: {trainer?.name || 'Unknown'}</span>
                                            </div>
                                            <p className="text-sm mb-4">{course.description}</p>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-4" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                                                <div>
                                                    <span className="text-xs text-muted">Category</span>
                                                    <p className="font-semibold">{course.category}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted">Level</span>
                                                    <p className="font-semibold">{course.level}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted">Modules</span>
                                                    <p className="font-semibold">{course.partsCount}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted">Trainer Base Price</span>
                                                    <p className="font-semibold">${course.trainer_price}</p>
                                                </div>
                                            </div>

                                            <div className="mb-4" style={{ border: '2px dashed var(--primary-blue)', padding: '1rem', borderRadius: '8px' }}>
                                                <label className="font-bold block mb-2">Set Final Platform Fee ($)</label>
                                                <input 
                                                    type="number" 
                                                    className="input-field"
                                                    value={coursePrices[course.id] || course.trainer_price} 
                                                    onChange={(e) => setCoursePrices({...coursePrices, [course.id]: e.target.value})}
                                                    style={{ width: '100%', fontSize: '1.2rem', padding: '0.5rem' }} 
                                                />
                                                <p className="text-xs text-muted mt-2">This is the price the trainees will see.</p>
                                            </div>

                                            <div className="flex-row gap-2" style={{ justifyContent: 'flex-end' }}>
                                                <button className="btn" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={() => handleRejectCourse(course.id)}>
                                                    Reject
                                                </button>
                                                <button className="btn btn-primary" style={{ background: '#16a34a' }} onClick={() => handleApproveCourse(course)}>
                                                    Approve & Publish
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
