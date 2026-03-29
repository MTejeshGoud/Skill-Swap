import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-col" style={{
            minHeight: '100vh',
            padding: '2rem',
            justifyContent: 'space-between',
            maxWidth: '100%'
        }}>

            {/* Header/Logo area */}
            <div className="flex-center flex-col gap-2 animate-fade-in" style={{ marginTop: '4rem' }}>
                <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    background: 'var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 28,
                    fontWeight: 'bold',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    S
                </div>
                <h1 className="text-2xl font-bold" style={{ marginTop: '1rem', color: '#1E293B' }}>SkillOrbit</h1>
                <p className="text-muted text-center" style={{ fontSize: '1.1rem' }}>
                    Exchange Skills. Elevate Life.
                </p>
            </div>

            {/* Hero Illustration Area */}
            <div className="flex-center animate-fade-in" style={{
                flex: 1,
                position: 'relative',
                padding: '2rem 0',
                animationDelay: '0.1s'
            }}>
                {/* Abstract Composition */}
                <div style={{ position: 'relative', width: 280, height: 280 }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 50% 50%, #EFF6FF 0%, transparent 70%)',
                        zIndex: 0
                    }} />

                    {/* Floating Elements */}
                    <div className="card" style={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        padding: '12px',
                        transform: 'rotate(-5deg)',
                        zIndex: 1
                    }}>
                        <span style={{ fontSize: '2rem' }}>🎨</span>
                    </div>

                    <div className="card" style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '5%',
                        padding: '12px',
                        transform: 'rotate(5deg)',
                        zIndex: 2
                    }}>
                        <span style={{ fontSize: '2rem' }}>💻</span>
                    </div>

                    <div className="card" style={{
                        position: 'absolute',
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '16px',
                        zIndex: 3,
                        boxShadow: 'var(--shadow-premium)'
                    }}>
                        <span style={{ fontSize: '3rem' }}>🤝</span>
                    </div>
                </div>
            </div>

            {/* Action Area */}
            <div className="flex-col gap-4 animate-fade-in" style={{
                width: '100%',
                marginBottom: '2rem',
                animationDelay: '0.2s'
            }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <h2 className="text-xl font-bold text-main" style={{ marginBottom: '0.5rem' }}>
                        Learn anything,<br />from anyone.
                    </h2>
                    <p className="text-muted text-sm">
                        Join a community of lifelong learners today.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/register')}
                    style={{ height: '3.5rem', fontSize: '1.1rem' }}
                >
                    Get Started
                </button>

                <div className="text-center">
                    <span className="text-muted text-sm">Have an account? </span>
                    <span
                        onClick={() => navigate('/login')}
                        className="text-primary font-semibold"
                        style={{ cursor: 'pointer' }}
                    >
                        Log in
                    </span>
                </div>
            </div>

        </div>
    );
};

export default Welcome;
