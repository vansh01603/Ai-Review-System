import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import '../styles/Dashboard.css';

const CODE_KEY = 'cr_code';
const LANG_KEY = 'cr_language';

const Dashboard = () => {
    const navigate = useNavigate();

    const [code, setCode] = useState(() => {
        return localStorage.getItem(CODE_KEY) || '// Write your code here';
    });
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem(LANG_KEY) || 'java';
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        localStorage.setItem(CODE_KEY, code);
    }, [code]);

    useEffect(() => {
        localStorage.setItem(LANG_KEY, language);
    }, [language]);

    const languageMap = {
        java: 'Java',
        python: 'Python',
        c: 'C',
        cpp: 'C++',
        javascript: 'JavaScript',
    };

    const handleReview = async () => {
        if (!code.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/review/submit', {
                code,
                language: languageMap[language],
            });
            if (res.data.success) {
                navigate('/result', { state: { result: res.data, code, language } });
            } else {
                setError('Review failed. Please try again.');
            }
        } catch (err) {
            if (err.response && err.response.status === 429) {
                setToast({
                    type: 'warning',
                    message: "You've reached the review limit (3 per 2 hours). Please try again later."
                });
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
        setLoading(false);
    };

    return (
        <div className="dashboard">
            <Navbar />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>AI Code Review</h1>
                    <p>Paste your code and get instant AI-powered feedback</p>
                </div>

                <div className="editor-section">
                    <div className="editor-toolbar">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="language-select">
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                            <option value="c">C</option>
                            <option value="cpp">C++</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                        <button
                            onClick={handleReview}
                            disabled={loading}
                            className="review-btn">
                            {loading ? '⏳ Reviewing...' : '⚡ Review Code'}
                        </button>
                    </div>

                    <div className="editor-wrapper">
                        <Editor
                            height="500px"
                            language={language}
                            value={code}
                            onChange={(val) => setCode(val ?? '')}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                            }}
                        />
                    </div>
                </div>

                {error && <div className="error-msg">{error}</div>}
            </div>
        </div>
    );
};

export default Dashboard;