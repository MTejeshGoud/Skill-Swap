import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-col" style={{ height: '100%', padding: '2rem', justifyContent: 'space-between', paddingBottom: '3rem' }}>

            {/* Header/Logo area could go here */}
            <div className="flex-center flex-col gap-4" style={{ marginTop: '2rem' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 32, fontWeight: 'bold' }}>
                    S
                </div>
                <h1 className="text-2xl font-bold" style={{ color: '#111' }}>SkillOrbit</h1>
                <p className="text-muted">Exchange Skills.<br />Elevate Life.</p>
            </div>

            {/* Hero Illustration Placeholder */}
            <div className="flex-center" style={{ flex: 1, position: 'relative' }}>
                {/* Simple CSS Illustration */}
                <div style={{ width: 200, height: 200, background: '#EFF6FF', borderRadius: '50%', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '20%', left: '25%', fontSize: 60 }}>👩‍💻</div>
                    <div style={{ position: 'absolute', top: '20%', right: '15%', background: '#8B5CF6', padding: 8, borderRadius: 8, color: 'white' }}>
                        ⭐
                    </div>
                </div>
                <div style={{ position: 'absolute', top: '10%' }}>
                    <h2 className="text-xl font-bold text-center">Learn anything,<br />from anyone.</h2>
                </div>
            </div>

            <button className="btn btn-primary" onClick={() => navigate('/home')}>
                Get Started
            </button>

        </div>
    );
};

export default Welcome;
