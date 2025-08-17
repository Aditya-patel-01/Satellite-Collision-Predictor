// ########################################## Enhanced CollisionLab with Modern Space UI

import { useState, useRef, useEffect } from "react";
import { Viewer, Entity } from "resium";
import { Ion, Cartesian3, Color, CallbackProperty } from "cesium";
import axios from "axios";
import "cesium/Build/Cesium/Widgets/widgets.css";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MjFmYjk5Ny1hNDMwLTRjOWQtOGUzYS1jMWQ1YjkxYWM4ZTkiLCJpZCI6MzE4NTI5LCJpYXQiOjE3NTE2Mjg0MTZ9.-bkIIsYw4lJpqksYU_jlYSIZz4-ZBQmo1pALRW_CCK0";

function CollisionLab() {
  const [tle1, setTle1] = useState("");
  const [tle2, setTle2] = useState("");
  const [prediction, setPrediction] = useState("");
  const [satellites, setSatellites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const trailsRef = useRef({});
  const animationRef = useRef(null);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  const handlePredictAndVisualize = async () => {
    if (!tle1.trim() || !tle2.trim()) {
      setError("Please enter TLE data for both satellites.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/satellite/visualize/",
        { tle1, tle2 }
      );

      const data = response.data;
      setPrediction(data.prediction);

      // Process satellite data for visualization
      trailsRef.current = {};
      const processed = data.trails.map((sat) => {
        const positions = sat.positions.map((p) => ({
          time: new Date(p.timestamp),
          pos: Cartesian3.fromElements(
            p.position[0] * 1000,
            p.position[1] * 1000,
            p.position[2] * 1000
          ),
        }));
        trailsRef.current[sat.name] = positions;
        return { name: sat.name, trail: positions };
      });

      setSatellites(processed);
      setCurrentTimeIndex(0);

      if (animationRef.current) clearInterval(animationRef.current);
      setIsAnimating(true);

      animationRef.current = setInterval(() => {
        setCurrentTimeIndex((prev) => {
          const maxIndex = processed[0]?.trail?.length || 0;
          const speedFactor = 2; // adjust for animation speed

          if (data.prediction === "collision") {
            // Stop at collision point (last frame from backend)
            if (prev + speedFactor >= maxIndex - 1) {
              clearInterval(animationRef.current);
              setIsAnimating(false);
              return maxIndex - 1;
            }
            return prev + speedFactor;
          } else {
            // Loop infinitely if no collision
            return (prev + speedFactor) % maxIndex;
          }
        });
      }, 100);
    } catch (error) {
      console.error("Prediction failed:", error);
      setError("Failed to predict collision. Please check your TLE data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopAnimation = () => {
    if (animationRef.current) clearInterval(animationRef.current);
    setIsAnimating(false);
  };

  const handleClearData = () => {
    setTle1("");
    setTle2("");
    setPrediction("");
    setSatellites([]);
    setError(null);
    setCurrentTimeIndex(0);
    setIsAnimating(false);
    trailsRef.current = {};
    if (animationRef.current) clearInterval(animationRef.current);
  };

  const colors = [Color.GREEN, Color.YELLOW];

  return (
    <div className="collision-lab-container">
      {/* Header Section */}
      <section className="lab-header">
        <h1>💥 Satellite Collision Predictor</h1>
        <p className="lab-description">
          Analyze orbital paths and predict potential collisions between satellites
        </p>
      </section>

      {/* Input Section */}
      <section className="input-section">
        <div className="input-card">
          <h2>📡 Satellite TLE Data</h2>
          <p className="input-description">
            Enter TLE (Two-Line Element) data for two satellites to analyze collision probability
          </p>
          
          <div className="tle-inputs">
            <div className="tle-group">
              <label htmlFor="tle1">Satellite 1 TLE Data</label>
              <textarea
                id="tle1"
                rows="4"
                placeholder="Enter TLE data for Satellite 1 (2 lines)&#10;Example:&#10;1 25544U 98067A   21001.50000000  .00000000  00000+0  00000+0 0    04&#10;2 25544  51.6400 114.5000 0000001   0.0000   0.0000 15.48905382    01"
                value={tle1}
                onChange={(e) => setTle1(e.target.value)}
                className="tle-textarea"
              />
            </div>
            
            <div className="tle-group">
              <label htmlFor="tle2">Satellite 2 TLE Data</label>
              <textarea
                id="tle2"
                rows="4"
                placeholder="Enter TLE data for Satellite 2 (2 lines)&#10;Example:&#10;1 27607U 02058A   23123.48440972  .00000033  00000-0  15388-4 0  9991&#10;2 27607  99.1001  19.7904 0013104 304.4307  55.5070 14.12415077 76741"
                value={tle2}
                onChange={(e) => setTle2(e.target.value)}
                className="tle-textarea"
              />
            </div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={handlePredictAndVisualize}
              className="predict-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="button-icon">🔍</span>
                  Predict & Visualize
                </>
              )}
            </button>
            
            <button
              onClick={handleStopAnimation}
              className="stop-button"
              disabled={!isAnimating}
            >
              <span className="button-icon">⏹️</span>
              Stop Animation
            </button>
            
            <button
              onClick={handleClearData}
              className="clear-button"
            >
              <span className="button-icon">🗑️</span>
              Clear Data
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {prediction && (
        <section className="results-section">
          <div className="results-card">
            <h2>📊 Collision Analysis Results</h2>
            
            <div className="prediction-result">
              <div className={`prediction-indicator ${prediction === 'collision' ? 'collision' : 'no-collision'}`}>
                <span className="prediction-icon">
                  {prediction === 'collision' ? '💥' : '✅'}
                </span>
                <span className="prediction-text">
                  {prediction === 'collision' ? 'COLLISION DETECTED' : 'NO COLLISION'}
                </span>
              </div>
              
              <p className="prediction-description">
                {prediction === 'collision' 
                  ? 'The analysis indicates a potential collision between the satellites based on their orbital parameters.'
                  : 'The satellites appear to have safe orbital paths with no collision risk detected.'
                }
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Error Display */}
      {error && (
        <section className="error-section">
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
          </div>
        </section>
      )}

      {/* Visualization Section */}
      <section className="visualization-section">
        <div className="viewer-container">
          <div className="viewer-header">
            <h2>🌍 Orbital Path Visualization</h2>
            <p className="viewer-description">
              Real-time 3D visualization of satellite orbital paths and collision analysis
            </p>
          </div>
          
          <div className="viewer-wrapper">
            <Viewer 
              style={{ width: "100%", height: "70vh", borderRadius: "12px" }}
              fullscreenButton={false}
              homeButton={false}
              navigationHelpButton={false}
              animation={false}
              timeline={false}
              baseLayerPicker={false}
              geocoder={false}
            >
              {satellites.map((sat, index) => {
                const trail = (trailsRef.current[sat.name] || []).map((t) => t.pos);
                const current = trailsRef.current[sat.name]?.[currentTimeIndex]?.pos;
                if (!current || trail.length === 0) return null;

                return (
                  <Entity
                    key={sat.name}
                    name={sat.name}
                    position={current}
                    point={{ 
                      pixelSize: 15, 
                      color: colors[index % colors.length],
                      outlineColor: Color.WHITE,
                      outlineWidth: 2
                    }}
                    description={`Satellite ${index + 1}: ${sat.name}`}
                  >
                    <Entity
                      polyline={{
                        positions: new CallbackProperty(
                          () => trail.slice(0, currentTimeIndex + 1),
                          false
                        ),
                        width: 3,
                        material: colors[index % colors.length],
                      }}
                    />
                  </Entity>
                );
              })}
            </Viewer>
          </div>
          
          {/* Legend */}
          {satellites.length > 0 && (
            <div className="viewer-legend">
              <h3>Satellite Legend</h3>
              <div className="legend-items">
                {satellites.map((sat, index) => (
                  <div key={sat.name} className="legend-item">
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: colors[index % colors.length].toCssColorString() }}
                    ></div>
                    <span className="legend-label">Satellite {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-card">
          <h2>🔬 How It Works</h2>
          <p>
            The collision prediction system analyzes the orbital parameters of two satellites using their TLE data. 
            It calculates their trajectories and determines if their paths will intersect, indicating a potential collision.
          </p>
          <div className="info-features">
            <div className="info-feature">
              <span className="feature-icon">🧮</span>
              <span>Orbital parameter analysis</span>
            </div>
            <div className="info-feature">
              <span className="feature-icon">📈</span>
              <span>Trajectory calculation</span>
            </div>
            <div className="info-feature">
              <span className="feature-icon">🎯</span>
              <span>Collision probability assessment</span>
            </div>
            <div className="info-feature">
              <span className="feature-icon">🌐</span>
              <span>3D path visualization</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CollisionLab;