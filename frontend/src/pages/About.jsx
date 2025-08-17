

// About.jsx
function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Satellite Collision Predictor</h1>
          <p className="hero-description">
            Advanced orbital analysis and collision prediction system using cutting-edge technology
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="content-card">
          <h2>Our Mission</h2>
          <p>
            The Satellite Collision Predictor is a sophisticated system designed to monitor and predict 
            potential collisions between satellites in Earth's orbit. Using advanced machine learning 
            algorithms and real-time TLE (Two-Line Element) data, we provide accurate collision predictions 
            to help maintain the safety and sustainability of space operations.
          </p>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-section">
        <h2>Technology Stack</h2>
        <div className="tech-grid">
          <div className="tech-card">
            <div className="tech-icon">🤖</div>
            <h3>Machine Learning</h3>
            <p>Advanced ML models trained on historical collision data for accurate predictions</p>
            <ul>
              <li>Random Forest Classifiers</li>
              <li>Neural Networks</li>
              <li>Real-time Data Processing</li>
            </ul>
          </div>

          <div className="tech-card">
            <div className="tech-icon">🌍</div>
            <h3>3D Visualization</h3>
            <p>Interactive 3D visualization using Cesium.js for orbital analysis</p>
            <ul>
              <li>Cesium.js Integration</li>
              <li>Real-time Orbit Rendering</li>
              <li>Collision Scenario Visualization</li>
            </ul>
          </div>

          <div className="tech-card">
            <div className="tech-icon">📡</div>
            <h3>Orbital Mechanics</h3>
            <p>Precise orbital calculations using SGP4 propagation algorithms</p>
            <ul>
              <li>SGP4 Propagation</li>
              <li>TLE Data Processing</li>
              <li>Orbital Element Analysis</li>
            </ul>
          </div>

          <div className="tech-card">
            <div className="tech-icon">⚡</div>
            <h3>Real-time Processing</h3>
            <p>High-performance backend with Django REST API</p>
            <ul>
              <li>Django REST Framework</li>
              <li>Real-time Data Updates</li>
              <li>Scalable Architecture</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="features-overview">
        <div className="content-card">
          <h2>Key Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-bullet">🎯</span>
              <div>
                <h3>Real-time Satellite Tracking</h3>
                <p>Monitor thousands of satellites in real-time using up-to-date TLE data from space agencies.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-bullet">💥</span>
              <div>
                <h3>Collision Prediction</h3>
                <p>Advanced algorithms predict potential collisions with high accuracy and provide risk assessments.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-bullet">🛰️</span>
              <div>
                <h3>Orbit Visualization</h3>
                <p>Interactive 3D visualization of satellite orbits and potential collision scenarios.</p>
              </div>
            </div>

            {/* <div className="feature-item">
              <span className="feature-bullet">📊</span>
              <div>
                <h3>Data Analytics</h3>
                <p>Comprehensive analysis of orbital data with detailed collision probability assessments.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-bullet">🚨</span>
              <div>
                <h3>Alert System</h3>
                <p>Real-time alerts for high-risk collision scenarios with detailed mitigation recommendations.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-bullet">📈</span>
              <div>
                <h3>Performance Metrics</h3>
                <p>Track prediction accuracy and system performance with detailed analytics and reporting.</p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="data-sources">
        <div className="content-card">
          <h2>Data Sources</h2>
          <p>
            Our system utilizes data from multiple reliable sources to ensure accurate predictions:
          </p>
          <div className="sources-grid">
            <div className="source-item">
              <h3>🌐 Space-Track.org</h3>
              <p>Official US Space Force database providing TLE data for active satellites</p>
            </div>
            <div className="source-item">
              <h3>🛰️ CelesTrak</h3>
              <p>Comprehensive satellite tracking data and orbital elements</p>
            </div>
            <div className="source-item">
              <h3>📡 NORAD</h3>
              <p>North American Aerospace Defense Command satellite catalog</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Info */}
      <section className="contact-section">
        <div className="content-card">
          <h2>Get Started</h2>
          <p>
            Ready to explore satellite orbits and predict potential collisions? 
            Start using our advanced tools today.
          </p>
          <div className="contact-buttons">
            <a href="/collision" className="cta-button primary">
              <span className="button-icon">💥</span>
              Start Collision Analysis
            </a>
            <a href="/orbit" className="cta-button secondary">
              <span className="button-icon">🛰️</span>
              Explore Orbits
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
