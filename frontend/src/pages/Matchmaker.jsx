import React, { useState } from 'react';
import { Smile } from 'lucide-react';

const Matchmaker = () => {
    const [query, setQuery] = useState('Learn Spanish');

    return (
        <div className="p-6 flex-col gap-6 animate-fade-in" style={{ height: '100%' }}>
            <div className="flex-row items-center gap-2">
                <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
                <h1 className="text-xl font-bold">AI Matchmaker</h1>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2 className="text-2xl font-bold">What do you <br />want to learn?</h2>
            </div>

            <div className="card flex-row items-center gap-4" style={{ padding: '1.5rem' }}>
                <div style={{ padding: 12, borderRadius: '50%', background: '#F5A623', color: 'white' }}>
                    <Smile color="white" />
                </div>

                <div className="flex-col">
                    <span className="text-sm text-muted">I want to...</span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ fontSize: '1.25rem', fontWeight: 'bold', border: 'none', outline: 'none', background: 'transparent' }}
                    />
                </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button className="btn btn-primary">Connect</button>
                <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)' }}>Not interested</button>
            </div>
        </div>
    );
};

export default Matchmaker;
