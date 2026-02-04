import React from 'react';
import { Wallet, Users, Brain, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        { name: 'Skill Wallet', icon: Wallet, color: '#22C55E', path: '/profile' },
        { name: 'Circles', icon: Users, color: '#F97316', path: '/circles' },
        { name: 'AI Matchmaker', icon: Brain, color: '#3B82F6', path: '/matchmaker' },
        { name: 'Trust Badges', icon: ShieldCheck, color: '#EF4444', path: '#' },
    ];

    return (
        <div className="p-6 flex-col gap-6 animate-fade-in" style={{ paddingBottom: '80px' }}>

            {/* Header */}
            <div className="flex-row items-center gap-4" style={{ marginBottom: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    <div style={{ width: 24, height: 24, background: '#F5A623', borderRadius: '0 0 12px 12px', transform: 'rotate(-45deg)', marginLeft: 12, marginTop: 12 }}></div>
                </div>
                <h1 className="text-2xl font-bold">SkillSwap</h1>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {features.map((item, idx) => (
                    <div
                        key={idx}
                        className="card flex-col items-center justify-center gap-4 text-center"
                        style={{ aspectRatio: '1/1', cursor: 'pointer' }}
                        onClick={() => item.path !== '#' && navigate(item.path)}
                    >
                        <item.icon size={48} color={item.color} strokeWidth={1.5} />
                        <span className="font-semibold text-sm">{item.name}</span>
                    </div>
                ))}
            </div>

            {/* Call to Action */}
            <div className="card bg-primary text-white flex-col gap-4" style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', color: 'white' }}>
                <h3 className="font-bold text-lg">Ready to swap?</h3>
                <p className="text-sm" style={{ opacity: 0.9 }}>Find your perfect skill match today.</p>

                <button className="btn" style={{ background: 'white', color: '#2563EB' }} onClick={() => navigate('/matchmaker')}>
                    Find a Match
                </button>
            </div>

        </div>
    );
};

export default Home;
