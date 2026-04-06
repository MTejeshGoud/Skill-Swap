import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, TrendingUp, Award, PlusCircle, DollarSign, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/userService';
import { getApprovedCourses } from '../services/courseService';

const Home = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const isTrainer = currentUser?.role === 'Trainer';
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const data = await getApprovedCourses();
            setCourses(data);
        };
        fetchCourses();
    }, []);

    const traineeFeatures = [
        { name: 'Browse Courses', icon: BookOpen, color: '#3B82F6', action: () => document.getElementById('courses-section').scrollIntoView({ behavior: 'smooth' }) },
        { name: 'Unlock Videos', icon: PlayCircle, color: '#F97316', action: () => {} },
        { name: 'Track Progress', icon: TrendingUp, color: '#22C55E', action: () => {} },
        { name: 'Certificates', icon: Award, color: '#8B5CF6', action: () => {} },
    ];

    const trainerFeatures = [
        { name: 'Create Course', icon: PlusCircle, color: '#8B5CF6', action: () => navigate('/trainer') },
        { name: 'My Dashboard', icon: BookOpen, color: '#3B82F6', action: () => navigate('/trainer') },
        { name: 'Set Prices', icon: DollarSign, color: '#F97316', action: () => navigate('/trainer') },
        { name: 'Reviews', icon: Star, color: '#22C55E', action: () => navigate('/reviews') },
    ];

    const features = isTrainer ? trainerFeatures : traineeFeatures;

    return (
        <div className="p-6 flex-col gap-6 animate-fade-in" style={{ paddingBottom: '4rem' }}>

            {/* Header */}
            <div className="flex-row items-center gap-4" style={{ marginBottom: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    <div style={{ width: 24, height: 24, background: '#F5A623', borderRadius: '0 0 12px 12px', transform: 'rotate(-45deg)', marginLeft: 12, marginTop: 12 }}></div>
                </div>
                <h1 className="text-2xl font-bold">SkillSwap</h1>
            </div>

            {/* Welcome User */}
            {currentUser && (
                <div style={{ marginBottom: '0.5rem' }}>
                    <p className="text-main font-semibold">Welcome back, {currentUser.name.split(' ')[0]}!</p>
                    <p className="text-sm text-muted">{isTrainer ? 'Trainer Dashboard' : 'Trainee Dashboard'}</p>
                </div>
            )}

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                {features.map((item, idx) => (
                    <div
                        key={idx}
                        className="card flex-col items-center justify-center gap-3 text-center"
                        style={{ padding: '1.5rem 1rem', cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={item.action}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <item.icon size={36} color={item.color} strokeWidth={1.5} />
                        <span className="font-semibold text-sm">{item.name}</span>
                    </div>
                ))}
            </div>

            {/* Available Courses Section */}
            <div id="courses-section" style={{ marginTop: '2rem' }}>
                <h2 className="text-xl font-bold mb-4">Available Courses</h2>
                {courses.length === 0 ? (
                    <div className="card text-center p-8 text-muted border-dashed">
                        No courses available right now. Check back later!
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {courses.map(course => (
                            <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                                <div style={{ height: '140px', background: course.thumbnail ? `url(${course.thumbnail}) center/cover` : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {!course.thumbnail && <span className="text-muted font-bold">No Thumbnail</span>}
                                </div>
                                <div className="p-4 flex-col justify-between" style={{ flex: 1, gap: '1rem' }}>
                                    <div>
                                        <div className="flex-row justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                                            <span className="font-bold text-green-600">${course.final_price || course.trainer_price}</span>
                                        </div>
                                        <p className="text-sm text-muted line-clamp-2 mb-2">{course.description}</p>
                                        <div className="flex-row gap-2">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{course.category}</span>
                                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{course.level}</span>
                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{course.partsCount} Modules</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={() => alert('Purchase flow not implemented.')}>
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Call to Action */}
            <div className="card text-white flex-col gap-4" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}>
                <h3 className="font-bold text-lg">{isTrainer ? "Ready to teach?" : "Ready to learn?"}</h3>
                <p className="text-sm" style={{ opacity: 0.9 }}>
                    {isTrainer ? "Create a new course to share your expertise." : "Enroll in courses and download your certificates."}
                </p>

                <button className="btn" style={{ background: 'white', color: '#2563EB' }} onClick={() => navigate(isTrainer ? '/trainer' : '#courses-section')}>
                    {isTrainer ? "Create Course" : "Browse Courses"}
                </button>
            </div>

        </div>
    );
};

export default Home;
