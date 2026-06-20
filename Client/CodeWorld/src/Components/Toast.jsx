import { useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type = 'error', onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    if (!message) return null;

    return (
        <div className={`toast toast-${type}`}>
            <span className="toast-icon">
                {type === 'error' ? '⛔' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={onClose}>✕</button>
        </div>
    );
};

export default Toast;