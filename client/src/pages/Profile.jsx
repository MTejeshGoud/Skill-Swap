import React from 'react';

const Profile = () => {
    const teachSkills = ['Public Speaking', 'Programming'];
    const learnSkills = ['Graphic Design', 'Photography'];

    return (
        <div className="p-6 flex-col gap-6 animate-fade-in">
            <div className="flex-row items-center gap-2">
                <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
                <h1 className="text-xl font-bold">Skill Profile</h1>
            </div>

            {/* Skills I can teach */}
            <div>
                <h3 className="text-sm font-semibold mb-2">Skills I can teach</h3>
                <div className="flex-col gap-2">
                    {teachSkills.map(skill => (
                        <div key={skill} className="card flex-row justify-between items-center p-4">
                            <span>{skill}</span>
                            <span className="text-muted">+</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills I want to learn */}
            <div>
                <h3 className="text-sm font-semibold mb-2">Skills I want to learn</h3>
                <div className="flex-col gap-2">
                    {learnSkills.map(skill => (
                        <div key={skill} className="card flex-row justify-between items-center p-4" style={{ background: '#F8FAFC' }}>
                            <span>{skill}</span>
                            <span className="text-muted">-</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div className="flex-row justify-between items-center" style={{ marginTop: '1rem' }}>
                <h3 className="font-bold">Availability</h3>
                <span className="text-primary text-sm font-semibold">Edit</span>
            </div>

            <div className="card p-4">
                Weekdays
            </div>

        </div>
    );
};

export default Profile;
