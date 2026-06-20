import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import '../styles/History.css';

const History = () => {
    const [reviews, setReviews] = useState([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await API.get('/review/history');
            if (res.data.success) {
                setReviews(res.data.reviews);
                setTotalReviews(res.data.totalReviews);
            }
        } catch (err) {
            console.error('Failed to fetch history');
        }
        setLoading(false);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#00ff88';
        if (score >= 60) return '#ffaa00';
        return '#ff4444';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="history-page">
            <Navbar />
            <div className="history-container">
                <div className="history-header">
                    <h1>Review History</h1>
                    <div className="history-stats">
                        <div className="stat-card">
                            <span className="stat-number">{totalReviews}</span>
                            <span className="stat-label">Total Reviews</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading history...</div>
                ) : reviews.length === 0 ? (
                    <div className="empty-state">
                        <p>No reviews yet. Go review some code!</p>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <div
                                    className="review-item-header"
                                    onClick={() => setExpanded(expanded === review.id ? null : review.id)}>
                                    <div className="review-item-left">
                                        <span className="review-language">{review.language}</span>
                                        <span className="review-date">{formatDate(review.createdAt)}</span>
                                    </div>
                                    <div className="review-item-right">
                                        <span className="review-score"
                                            style={{ color: getScoreColor(review.qualityScore) }}>
                                            {review.qualityScore}/100
                                        </span>
                                        <span className="expand-icon">
                                            {expanded === review.id ? '▲' : '▼'}
                                        </span>
                                    </div>
                                </div>

                                {expanded === review.id && (
                                    <div className="review-item-body">
                                        <div className="review-detail">
                                            <h4>🐛 Bug Detection</h4>
                                            <p>{review.bugDetection}</p>
                                        </div>
                                        <div className="review-detail">
                                            <h4>✅ Best Practices</h4>
                                            <p>{review.bestPractices}</p>
                                        </div>
                                        <div className="review-detail">
                                            <h4>⏱ Complexity</h4>
                                            <p>{review.complexityAnalysis}</p>
                                        </div>
                                        <div className="review-detail">
                                            <h4>💻 Original Code</h4>
                                            <pre><code>{review.code}</code></pre>
                                        </div>
                                        <div className="review-detail">
                                            <h4>🔧 Refactored Code</h4>
                                            <pre><code>{review.refactoredCode}</code></pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;