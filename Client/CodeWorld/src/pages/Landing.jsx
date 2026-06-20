import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
    const vantaRef = useRef(null);
    const vantaEffect = useRef(null);

    useEffect(() => {
        if (!vantaEffect.current && window.VANTA) {
            vantaEffect.current = window.VANTA.NET({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x4100ff,
                backgroundColor: 0x1e1d47,
                maxDistance: 24.00,
                spacing: 17.00
            });
        }
        return () => {
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };
    }, []);

    return (
        <div className="landing" ref={vantaRef}>
            <nav className="landing-nav">
                <div className="landing-brand">CodeReview AI</div>
                <div className="landing-nav-actions">
                    <Link to="/login" className="nav-btn-ghost">Login</Link>
                    <Link to="/register" className="nav-btn-solid">Get Started</Link>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-badge">Powered by Llama 3.3 70B</div>
                <h1>
                    Ship Better Code <br />
                    <span className="hero-highlight">With AI Code Review</span>
                </h1>
                <p className="hero-subtext">
                    Paste your Java or Python code and get instant bug detection,
                    best-practice feedback, complexity analysis, and a refactored
                    version all in seconds.
                </p>
                <div className="hero-actions">
                    <Link to="/register" className="hero-btn-primary">Start Reviewing (Free)</Link>
                    <Link to="/login" className="hero-btn-secondary">I have an account</Link>
                </div>
            </section>

            <section className="features">
                <div className="feature-card">
                    {/* <div className="feature-icon">🐛</div> */}
                    <h3>Bug Detection</h3>
                    <p>Catch logical errors and edge cases before they reach production.</p>
                </div>
                <div className="feature-card">
                    {/* <div className="feature-icon">✅</div> */}
                    <h3>Best Practices</h3>
                    <p>Get feedback on naming, structure, and clean-code conventions.</p>
                </div>
                <div className="feature-card">
                    {/* <div className="feature-icon">🔧</div> */}
                    <h3>Auto Refactor</h3>
                    <p>See an improved version of your code, ready to copy and use.</p>
                </div>
                <div className="feature-card">
                    {/* <div className="feature-icon">⏱</div> */}
                    <h3>Complexity Analysis</h3>
                    <p>Understand the time and space complexity in plain English.</p>
                </div>
            </section>

            <footer className="landing-footer">
                <p>Built with React, Spring Boot &amp; Groq AI</p>
            </footer>
        </div>
    );
};

export default Landing;