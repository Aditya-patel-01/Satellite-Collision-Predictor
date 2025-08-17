import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Satellite</span>
            <span className="title-line">Collision</span>
            <span className="title-line">Predictor</span>
          </h1>
          <p className="hero-subtitle">
            Advanced orbital analysis and collision prediction using machine learning
          </p>
          <div className="hero-buttons">
            <Link to="/collision" className="cta-button primary">
              <span className="button-icon">💥</span>
              Start Collision Analysis
            </Link>
            <Link to="/orbit" className="cta-button secondary">
              <span className="button-icon">🛰️</span>
              Explore Orbits
            </Link>
          </div>
        </div>
        
        {/* Floating satellites animation */}
        <div className="floating-satellites">
          <div className="satellite satellite-1">🛰️</div>
          <div className="satellite satellite-2">🛰️</div>
          <div className="satellite satellite-3">🛰️</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Advanced Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Real-time Tracking</h3>
            <p>Monitor satellite positions in real-time using TLE data and advanced orbital mechanics calculations.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>ML-Powered Prediction</h3>
            <p>Advanced machine learning algorithms predict potential collisions with high accuracy.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>3D Visualization</h3>
            <p>Interactive 3D visualization of satellite orbits and collision scenarios using Cesium.js.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Data Analytics</h3>
            <p>Comprehensive analysis of orbital data with detailed collision probability assessments.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Satellites Tracked</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">93.8%</div>
            <div className="stat-label">Prediction Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Real-time Monitoring</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3D</div>
            <div className="stat-label">Visualization</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Explore?</h2>
          <p>Start analyzing satellite orbits and predicting potential collisions today.</p>
          <Link to="/collision" className="cta-button primary large">
            <span className="button-icon">🚀</span>
            Launch Analysis
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
