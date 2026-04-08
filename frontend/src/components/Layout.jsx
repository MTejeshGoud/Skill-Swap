import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, User, Smile, LogOut } from 'lucide-react';
import { logoutUser } from '../services/userService';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Hide nav on Welcome logic and Auth pages
    const showNav = !['/', '/login', '/register', '/admin'].includes(location.pathname);

    const navItems = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: Users, label: 'Circles', path: '/circles' },
        { icon: Smile, label: 'Match', path: '/matchmaker' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div>

            {/* Top Navigation */}
            {showNav && (
                <nav className="top-nav">
                    <div 
                        className="brand-logo" 
                        onClick={() => navigate('/home')}
                    >
                        SkillSwap
                    </div>
                    <div className="nav-links">
                        {navItems.map((item, idx) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <div
                                    key={idx}
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => navigate(item.path)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    <span>{item.label}</span>
                                </div>
                            );
                        })}

                        {/* Logout Button */}
                        <div
                            className="nav-item"
                            onClick={() => {
                                logoutUser();
                                navigate('/');
                            }}
                            style={{ cursor: 'pointer', marginLeft: '1rem', color: 'var(--accent-red)' }}
                        >
                            <LogOut size={20} strokeWidth={2} />
                            <span>Logout</span>
                        </div>
                    </div>
                </nav>
            )}

            {/* Main Content Area */}
            <div style={{ padding: showNav ? '2rem' : '0' }}>
                <Outlet />
            </div>

        </div>
    );
};

export default Layout;
