import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">CodeReview AI</Link>
            </div>
            {user && (
                <div className="navbar-right">
                    <span className="navbar-username">👤 {user.username}</span>
                    <Link to="/dashboard" className="nav-link">Home</Link>
                    <Link to="/editor" className="nav-link">Review</Link>
                    <Link to="/history" className="nav-link">History</Link>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;