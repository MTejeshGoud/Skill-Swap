import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, User, Smile } from 'lucide-react';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Hide nav on Welcome page
    const showNav = location.pathname !== '/';

    const navItems = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: Users, label: 'Circles', path: '/circles' },
        { icon: Smile, label: 'Match', path: '/matchmaker' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="app-container">

            {/* Main Content Area */}
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <Outlet />
            </div>

            {/* Bottom Navigation */}
            {showNav && (
                <nav className="bottom-nav">
                    {navItems.map((item, idx) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div
                                key={idx}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => navigate(item.path)}
                                style={{ cursor: 'pointer' }}
                            >
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                {/* <span>{item.label}</span> optional text labels */}
                            </div>
                        );
                    })}
                </nav>
            )}

        </div>
    );
};

export default Layout;
