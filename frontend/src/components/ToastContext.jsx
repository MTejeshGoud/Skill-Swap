import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {toasts.map(t => (
                    <div key={t.id} style={{ 
                        padding: '12px 24px', 
                        borderRadius: '8px',
                        background: t.type === 'error' ? '#fee2e2' : '#dcfce7',
                        color: t.type === 'error' ? '#991b1b' : '#166534',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                        animation: 'fade-in 0.3s',
                        fontWeight: '500'
                    }}>
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
