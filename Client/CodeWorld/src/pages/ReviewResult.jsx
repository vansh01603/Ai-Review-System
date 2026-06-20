import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Navbar from '../components/Navbar';
import '../styles/ReviewResult.css';

const ReviewResult = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    if (!state || !state.result) {
        return (
            <div className="dashboard">
                <Navbar />
                <div className="dashboard-container">
                    <div className="empty-result">
                        <p>No review to show.</p>
                        <button className="review-btn" onClick={() => navigate('/dashboard')}>
                            Go to Editor
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { result, code, language } = state;

    const handleCopy = () => {
        navigator.clipboard.writeText(result.refactoredCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#00ff88';
        if (score >= 60) return '#ffaa00';
        return '#ff4444';
    };

    return (
        <div className="dashboard">
            <Navbar />
            <div className="dashboard-container">
                <div className="result-top-bar">
                    <button className="back-btn" onClick={() => navigate('/editor')}>
                        ← Back to Editor
                    </button>
                </div>

                <div className="results-section">
                    <h2>Review Results</h2>

                    <div className="score-card">
                        <div className="score-circle"
                            style={{ borderColor: getScoreColor(result.qualityScore) }}>
                            <span style={{ color: getScoreColor(result.qualityScore) }}>
                                {result.qualityScore}
                            </span>
                            <small>/ 100</small>
                        </div>
                        <div className="score-label">Quality Score</div>
                    </div>

                    <div className="results-grid">
                        <div className="result-card">
                            <h3>🐛 Bug Detection</h3>
                            <p>{result.bugDetection}</p>
                        </div>
                        <div className="result-card">
                            <h3>✅ Best Practices</h3>
                            <p>{result.bestPractices}</p>
                        </div>
                        <div className="result-card">
                            <h3>⏱ Complexity Analysis</h3>
                            <p>{result.complexityAnalysis}</p>
                        </div>
                    </div>

                    <div className="code-compare-grid">
                        <div className="refactored-section">
                            <div className="refactored-header">
                                <h3>💻 Original Code</h3>
                            </div>
                            <Editor
                                height="350px"
                                language={language}
                                value={code}
                                theme="vs-dark"
                                options={{
                                    fontSize: 14,
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                }}
                            />
                        </div>

                        <div className="refactored-section">
                            <div className="refactored-header">
                                <h3>🔧 Refactored Code</h3>
                                <button onClick={handleCopy} className="copy-btn">
                                    {copied ? '✅ Copied!' : '📋 Copy'}
                                </button>
                            </div>
                            <Editor
                                height="350px"
                                language={language}
                                value={result.refactoredCode}
                                theme="vs-dark"
                                options={{
                                    fontSize: 14,
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewResult;