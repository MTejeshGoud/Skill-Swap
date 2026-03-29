import React from 'react';
import { BookOpen, PlayCircle, TrendingUp, Award, PlusCircle, DollarSign, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/userService';

const Home = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const isTrainer = currentUser?.role === 'Trainer';

    const traineeFeatures = [
        { name: 'Browse Courses', icon: BookOpen, color: '#3B82F6', path: '/courses' },
        { name: 'Unlock Videos', icon: PlayCircle, color: '#F97316', path: '/payments' },
        { name: 'Track Progress', icon: TrendingUp, color: '#22C55E', path: '/progress' },
        { name: 'Certificates', icon: Award, color: '#8B5CF6', path: '/certificates' },
    ];

    const trainerFeatures = [
        { name: 'Create Course', icon: PlusCircle, color: '#8B5CF6', path: '/create-course' },
        { name: 'My Courses', icon: BookOpen, color: '#3B82F6', path: '/my-courses' },
        { name: 'Set Prices', icon: DollarSign, color: '#F97316', path: '/pricing' },
        { name: 'Reviews', icon: Star, color: '#22C55E', path: '/reviews' },
    ];

    const features = isTrainer ? trainerFeatures : traineeFeatures;

    return (
        <div className="p-6 flex-col gap-6 animate-fade-in">

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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: '800px' }}>
                {features.map((item, idx) => (
                    <div
                        key={idx}
                        className="card flex-col items-center justify-center gap-3 text-center"
                        style={{ padding: '2rem 1rem', cursor: 'pointer' }}
                        onClick={() => item.path !== '#' && navigate(item.path)}
                    >
                        <item.icon size={36} color={item.color} strokeWidth={1.5} />
                        <span className="font-semibold">{item.name}</span>
                    </div>
                ))}
            </div>

            {/* Call to Action */}
            <div className="card bg-primary text-white flex-col gap-4" style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', color: 'white' }}>
                <h3 className="font-bold text-lg">{isTrainer ? "Ready to teach?" : "Ready to learn?"}</h3>
                <p className="text-sm" style={{ opacity: 0.9 }}>
                    {isTrainer ? "Create a new course to share your expertise." : "Enroll in courses and download your certificates."}
                </p>

                <button className="btn" style={{ background: 'white', color: '#2563EB' }} onClick={() => navigate(isTrainer ? '/create-course' : '/courses')}>
                    {isTrainer ? "Create Course" : "Browse Courses"}
                </button>
            </div>

        </div>
    );
};

export default Home;
