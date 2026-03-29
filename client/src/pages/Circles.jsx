import React from 'react';
import { Search, MoreHorizontal } from 'lucide-react';

const Circles = () => {
    const circles = [
        { name: 'Software Developers', icon: '👩‍💻' },
        { name: 'Foodies & Cooks', icon: '🥘' },
        { name: 'Photography Enthusiasts', icon: '📸' },
        { name: 'Fitness Buddies', icon: '🏃' },
        { name: 'Language Learners', icon: '🗣️' }
    ];

    return (
        <div className="p-4 flex-col gap-6 animate-fade-in">
            <div className="flex-row items-center justify-between">
                <div className="flex-row items-center gap-2">
                    <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
                    <h1 className="text-xl font-bold">Circles</h1>
                </div>
                <button style={{ background: 'none', border: 'none' }}><MoreHorizontal /></button>
            </div>

            {/* Search */}
            <div className="flex-row items-center gap-2 p-4" style={{ background: '#F1F5F9', borderRadius: '12px' }}>
                <Search size={20} className="text-muted" />
                <input
                    type="text"
                    placeholder="Search"
                    style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                />
            </div>

            <div>
                <h2 className="text-sm font-semibold text-muted" style={{ marginBottom: '1rem' }}>Local Circles</h2>
                <div className="flex-col gap-4">
                    {circles.map((circle, idx) => (
                        <div key={idx} className="flex-row items-center gap-4 p-2 card" style={{ padding: '0.75rem', boxShadow: 'none', borderBottom: '1px solid #eee', background: 'transparent' }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                                {circle.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 className="font-semibold text-sm">{circle.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Circles;
