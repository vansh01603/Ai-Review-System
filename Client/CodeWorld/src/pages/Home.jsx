import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await API.get('/review/stats');
            if (res.data.success) {
                setStats(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats');
        }
        setLoading(false);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#00d97e';
        if (score >= 60) return '#ffaa00';
        return '#ff4444';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'No reviews yet';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="home-page">
                <Navbar />
                <div className="home-loading">Loading your dashboard...</div>
            </div>
        );
    }

    const hasReviews = stats && stats.totalReviews > 0;

    return (
        <div className="home-page">
            <Navbar />
            <div className="home-container">
                <div className="home-header">
                    <h1>Welcome back, {user?.username} 👋</h1>
                    <p>Here's how your code has been doing</p>
                </div>

                {!hasReviews ? (
                    <div className="empty-home">
                        <div className="empty-icon">📝</div>
                        <h3>No reviews yet</h3>
                        <p>Submit your first piece of code and see your stats here.</p>
                        <Link to="/editor" className="cta-btn">Start Your First Review</Link>
                    </div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="stat-box-value">{stats.totalReviews}</span>
                                <span className="stat-box-label">Total Reviews</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-box-value"
                                    style={{ color: getScoreColor(stats.averageScore) }}>
                                    {stats.averageScore}
                                </span>
                                <span className="stat-box-label">Average Score</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-box-value">
                                    {Object.keys(stats.languageBreakdown).length}
                                </span>
                                <span className="stat-box-label">Languages Used</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-box-value-small">
                                    {formatDate(stats.lastReviewDate)}
                                </span>
                                <span className="stat-box-label">Last Review</span>
                            </div>
                        </div>

                        <div className="home-bottom-grid">
                            <div className="trend-card">
                                <h3>Recent Score Trend</h3>
                                <div className="trend-bars">
                                    {stats.recentScores.slice().reverse().map((score, i) => (
                                        <div key={i} className="trend-bar-wrapper">
                                            <div
                                                className="trend-bar"
                                                style={{
                                                    height: `${Math.max(score, 5)}%`,
                                                    background: getScoreColor(score)
                                                }}
                                            />
                                            <span className="trend-bar-label">{score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lang-card">
                                <h3>Language Breakdown</h3>
                                <div className="lang-list">
                                    {Object.entries(stats.languageBreakdown).map(([lang, count]) => (
                                        <div key={lang} className="lang-row">
                                            <span className="lang-name">{lang}</span>
                                            <div className="lang-bar-track">
                                                <div
                                                    className="lang-bar-fill"
                                                    style={{
                                                        width: `${(count / stats.totalReviews) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="lang-count">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="home-actions">
                            <Link to="/editor" className="cta-btn">New Review</Link>
                            <Link to="/history" className="cta-btn-secondary">View Full History</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;