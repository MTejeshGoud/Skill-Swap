import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/userService';
import { getCoursesForTrainer, saveCourse } from '../services/courseService';
import { useToast } from '../components/ToastContext';

const TrainerDashboard = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    
    // View state: 'list', 'step1', 'step2', 'step3'
    const [view, setView] = useState('list');
    
    // Course Draft State
    const [draft, setDraft] = useState({
        id: null,
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        thumbnail: '',
        partsCount: 1,
        modules: [{ title: '', description: '', video: '', duration: '' }],
        trainer_price: ''
    });

    useEffect(() => {
        const fetchUI = async () => {
            const currentUser = await getCurrentUser();
            if (!currentUser || currentUser.role !== 'trainer') {
                navigate('/login');
                return;
            }
            setUser(currentUser);
            const data = await getCoursesForTrainer(currentUser.id);
            setCourses(data);
        };
        fetchUI();
    }, [navigate]);

    const refreshCourses = async (userId) => {
        const data = await getCoursesForTrainer(userId);
        setCourses(data);
    };

    const handleNextStep = (step) => {
        if (step === 'step2') {
            // Adjust modules array length based on partsCount
            const parts = parseInt(draft.partsCount) || 1;
            const newModules = [...draft.modules];
            if (parts > newModules.length) {
                for (let i = newModules.length; i < parts; i++) {
                    newModules.push({ title: '', description: '', video: '', duration: '' });
                }
            } else if (parts < newModules.length) {
                newModules.length = parts;
            }
            setDraft({ ...draft, modules: newModules });
        }
        setView(step);
    };

    const handleSaveAsDraft = async () => {
        const courseToSave = {
            ...draft,
            trainer_id: user.id,
            status: 'draft'
        };
        await saveCourse(courseToSave);
        addToast('Course saved as draft!');
        setView('list');
        await refreshCourses(user.id);
        // Reset draft
        setDraft({ id: null, title: '', description: '', category: '', level: 'Beginner', thumbnail: '', partsCount: 1, modules: [{ title: '', description: '', video: '', duration: '' }], trainer_price: '' });
    };

    const handleSubmitForApproval = async () => {
        if (!draft.trainer_price || parseFloat(draft.trainer_price) <= 0) {
            addToast('Please enter a valid price.', 'error');
            return;
        }
        const courseToSave = {
            ...draft,
            trainer_id: user.id,
            status: 'pending'
        };
        await saveCourse(courseToSave);
        addToast('Course submitted for approval!');
        setView('list');
        await refreshCourses(user.id);
        // Reset draft
        setDraft({ id: null, title: '', description: '', category: '', level: 'Beginner', thumbnail: '', partsCount: 1, modules: [{ title: '', description: '', video: '', duration: '' }], trainer_price: '' });
    };

    const handleEditCourse = (course) => {
        setDraft(course);
        setView('step1');
    };

    if (!user) return null;

    const pendingCourses = courses.filter(c => c.status === 'pending').length;
    const approvedCourses = courses.filter(c => c.status === 'approved').length;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem' }}>
            <div className="p-4" style={{ background: 'white', borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                    <h1 className="text-xl font-bold">Trainer Dashboard</h1>
                    <button className="btn" onClick={() => navigate('/profile')}>Profile</button>
                </div>
            </div>

            <div className="p-4">
                {!user.fee_paid && (
                    <div className="card" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⚠️</span>
                        <span><b>Action Required:</b> You must pay the platform fee out-of-system (or wait for Admin to clear it) before you can submit courses.</span>
                    </div>
                )}

                {view === 'list' && (
                    <div className="animate-fade-in flex-col gap-6">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="card text-center">
                                <h3 className="text-2xl font-bold">{courses.length}</h3>
                                <p className="text-sm text-muted">Total Courses</p>
                            </div>
                            <div className="card text-center" style={{ background: '#fffbeb' }}>
                                <h3 className="text-2xl font-bold text-yellow-600">{pendingCourses}</h3>
                                <p className="text-sm text-yellow-700">Pending</p>
                            </div>
                            <div className="card text-center" style={{ background: '#f0fdf4' }}>
                                <h3 className="text-2xl font-bold text-green-600">{approvedCourses}</h3>
                                <p className="text-sm text-green-700">Approved</p>
                            </div>
                        </div>

                        <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                            <h2 className="text-lg font-bold">Your Courses</h2>
                            <button 
                                className="btn btn-primary" 
                                onClick={() => setView('step1')}
                                disabled={!user.fee_paid && false /* let them draft even if not paid? Yes */}
                            >
                                + Create New Course
                            </button>
                        </div>

                        <div className="flex-col gap-4">
                            {courses.length === 0 ? (
                                <div className="text-center p-6 text-muted border border-dashed rounded-lg">No courses yet. Click create to begin!</div>
                            ) : (
                                courses.map(course => (
                                    <div key={course.id} className="card flex-row" style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <div>
                                            <div className="flex-row items-center gap-2 mb-1">
                                                <h3 className="font-bold">{course.title || 'Untitled Course'}</h3>
                                                <span style={{ 
                                                    fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold',
                                                    background: course.status === 'approved' ? '#dcfce7' : course.status === 'pending' ? '#fef3c7' : course.status === 'rejected' ? '#fee2e2' : '#f1f5f9',
                                                    color: course.status === 'approved' ? '#166534' : course.status === 'pending' ? '#b45309' : course.status === 'rejected' ? '#991b1b' : '#475569'
                                                }}>
                                                    {course.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted">{course.category || 'No Category'} • {course.partsCount} Modules</p>
                                            <p className="text-sm font-semibold mt-2">${course.final_price || course.trainer_price || '0'}</p>
                                        </div>
                                        {(course.status === 'draft' || course.status === 'rejected') && (
                                            <button className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => handleEditCourse(course)}>Edit</button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 1 */}
                {view === 'step1' && (
                    <div className="card animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                            <span className="font-bold" style={{ color: 'var(--primary-blue)' }}>Step 1: Basic Info</span>
                            <span className="text-muted">Step 2: Modules</span>
                            <span className="text-muted">Step 3: Pricing</span>
                        </div>
                        <h2 className="font-bold text-lg mb-4">Course Details</h2>
                        <div className="form-group">
                            <label className="form-label">Course Title</label>
                            <input className="form-input" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} placeholder="e.g. Advanced React Hooks" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input" value={draft.description} onChange={e => setDraft({...draft, description: e.target.value})} placeholder="What will students learn?" rows={4} style={{ resize: 'vertical' }} />
                        </div>
                        <div className="flex-row gap-4" style={{ marginBottom: '1rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Category</label>
                                <select value={draft.category} onChange={e => setDraft({...draft, category: e.target.value})} className="form-input">
                                    <option value="">Select Category</option>
                                    <option value="Programming">Programming</option>
                                    <option value="Design">Design</option>
                                    <option value="Business">Business</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Skill Level</label>
                                <select value={draft.level} onChange={e => setDraft({...draft, level: e.target.value})} className="form-input">
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-row gap-4 mb-6">
                            <div className="form-group" style={{ flex: 2 }}>
                                <label className="form-label">Thumbnail URL</label>
                                <input className="form-input" value={draft.thumbnail} onChange={e => setDraft({...draft, thumbnail: e.target.value})} placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Number of Parts</label>
                                <input className="form-input" type="number" min="1" max="20" value={draft.partsCount} onChange={e => setDraft({...draft, partsCount: parseInt(e.target.value) || 1})} />
                            </div>
                        </div>
                        <div className="flex-row" style={{ justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                            <button className="btn" style={{ background: '#f1f5f9', color: '#475569', boxShadow: 'none', maxWidth: '120px' }} onClick={() => setView('list')}>Cancel</button>
                            <button className="btn btn-primary" style={{ maxWidth: '180px' }} onClick={() => handleNextStep('step2')}>Next: Modules</button>
                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {view === 'step2' && (
                    <div className="card animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                            <span className="font-bold text-green-600">✓ Step 1</span>
                            <span className="font-bold" style={{ color: 'var(--primary-blue)' }}>Step 2: Modules</span>
                            <span className="text-muted">Step 3: Pricing</span>
                        </div>
                        <h2 className="font-bold text-lg mb-4">Course Content ({draft.partsCount} parts)</h2>
                        <div className="flex-col gap-4 mb-6">
                            {draft.modules.map((mod, i) => (
                                <div key={i} className="p-4" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                                    <h3 className="font-bold mb-3">Module {i + 1}</h3>
                                    <div className="form-group">
                                        <input className="form-input" value={mod.title} onChange={e => {
                                            const newMods = [...draft.modules];
                                            newMods[i].title = e.target.value;
                                            setDraft({...draft, modules: newMods});
                                        }} placeholder="Module Title" style={{ marginBottom: '0.5rem' }} />
                                    </div>
                                    <div className="form-group">
                                        <textarea className="form-input" value={mod.description} onChange={e => {
                                            const newMods = [...draft.modules];
                                            newMods[i].description = e.target.value;
                                            setDraft({...draft, modules: newMods});
                                        }} placeholder="What's in this module?" rows={2} style={{ marginBottom: '0.5rem', resize: 'vertical' }} />
                                    </div>
                                    <div className="flex-row gap-4" style={{ alignItems: 'flex-start' }}>
                                        <div style={{ flex: 2 }}>
                                            <input type="file" accept="video/*" className="form-input" style={{ padding: '0.4rem' }} onChange={e => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const newMods = [...draft.modules];
                                                    // In a real app we'd upload this file, for now we just save the name
                                                    newMods[i].video = file.name;
                                                    setDraft({...draft, modules: newMods});
                                                }
                                            }} />
                                            {mod.video && <p className="text-xs text-muted mt-1" style={{ marginLeft: '4px' }}>Selected: {mod.video}</p>}
                                        </div>
                                        <input className="form-input" style={{ flex: 1 }} value={mod.duration} onChange={e => {
                                            const newMods = [...draft.modules];
                                            newMods[i].duration = e.target.value;
                                            setDraft({...draft, modules: newMods});
                                        }} placeholder="e.g. 15 mins" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                            <button className="btn" onClick={() => handleNextStep('step1')}>Back</button>
                            <button className="btn btn-primary" onClick={() => handleNextStep('step3')}>Next: Pricing</button>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {view === 'step3' && (
                    <div className="card animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                            <span className="font-bold text-green-600">✓ Step 1</span>
                            <span className="font-bold text-green-600">✓ Step 2</span>
                            <span className="font-bold" style={{ color: 'var(--primary-blue)' }}>Step 3: Pricing</span>
                        </div>
                        <h2 className="font-bold text-lg mb-4">Pricing & Submission</h2>
                        <div className="form-group">
                            <label className="form-label">Trainer Price Base ($)</label>
                            <input className="form-input" type="number" min="0" step="0.01" value={draft.trainer_price} onChange={e => setDraft({...draft, trainer_price: e.target.value})} placeholder="e.g. 49.99" style={{ fontSize: '1.2rem', padding: '1rem', border: '2px solid var(--primary-blue)', fontWeight: 'bold' }} />
                            <p className="text-sm text-muted mt-2">Note: The Admin will review your course and might adjust the final price displayed to trainees.</p>
                        </div>

                        <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                            <h3 className="font-bold mb-2">Review Summary</h3>
                            <p><strong>Title:</strong> {draft.title || 'Untitled'}</p>
                            <p><strong>Category:</strong> {draft.category} • {draft.level}</p>
                            <p><strong>Modules:</strong> {draft.modules.length}</p>
                        </div>

                        <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                            <button className="btn" onClick={() => handleNextStep('step2')}>Back</button>
                            <div className="flex-row gap-2">
                                <button className="btn" style={{ background: '#e2e8f0' }} onClick={handleSaveAsDraft}>Save Draft</button>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ background: 'var(--accent-green)' }} 
                                    disabled={!user.fee_paid}
                                    onClick={handleSubmitForApproval}
                                    title={!user.fee_paid ? 'You must pay platform fee to submit' : ''}
                                >
                                    Submit for Approval
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerDashboard;
