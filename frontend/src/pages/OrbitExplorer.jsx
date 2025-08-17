// ########################################## Dynamic Satellite Management with TLE Input

import { useEffect, useRef, useState } from "react";
import { Viewer, Entity } from "resium";
import { Ion, Cartesian3, Color, CallbackProperty } from "cesium";
import axios from "axios";
import "cesium/Build/Cesium/Widgets/widgets.css";

// your working token
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MjFmYjk5Ny1hNDMwLTRjOWQtOGUzYS1jMWQ1YjkxYWM4ZTkiLCJpZCI6MzE4NTI5LCJpYXQiOjE3NTE2Mjg0MTZ9.-bkIIsYw4lJpqksYU_jlYSIZz4-ZBQmo1pALRW_CCK0";

function OrbitExplorer() {
  const [satellites, setSatellites] = useState([]);
  const [customSatellites, setCustomSatellites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTLE, setNewTLE] = useState("");
  const [newSatelliteName, setNewSatelliteName] = useState("");
  const [isAddingSatellite, setIsAddingSatellite] = useState(false);
  const trailsRef = useRef({}); // store trails by satellite name

  // Load existing custom satellites on component mount
  useEffect(() => {
    const loadCustomSatellites = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/orbit/satellites/");
        const satellitesData = response.data.satellites;
        
        const loadedSatellites = satellitesData.map(sat => ({
          name: sat.name,
          positions: [], // Will be populated by real-time updates
          color: getRandomColor()
        }));
        
        setCustomSatellites(loadedSatellites);
      } catch (error) {
        console.error("Failed to load custom satellites:", error);
      }
    };
    
    loadCustomSatellites();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://127.0.0.1:8000/api/orbit/positions/")
        .then((response) => {
          const newSatellites = response.data.satellites;
          setSatellites(newSatellites);
          setIsLoading(false);
          setError(null);

          // Update trails for all satellites (custom satellites from backend)
          newSatellites.forEach((sat) => {
            const pos = Cartesian3.fromElements(
              sat.position[0] * 1000,
              sat.position[1] * 1000,
              sat.position[2] * 1000
            );
            if (!trailsRef.current[sat.name]) {
              trailsRef.current[sat.name] = [];
            }
            trailsRef.current[sat.name].push(pos);
            // Trim trail length for performance
            if (trailsRef.current[sat.name].length > 500) {
              trailsRef.current[sat.name].shift();
            }
          });
        })
        .catch((error) => {
          console.error("API error:", error);
          setError("Failed to load satellite data. Please check your connection.");
          setIsLoading(false);
        });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Update custom satellites positions
  useEffect(() => {
    if (customSatellites.length === 0) return;

    const interval = setInterval(() => {
      customSatellites.forEach((sat) => {
        if (sat.positions && sat.positions.length > 0) {
          const currentIndex = Math.floor(Date.now() / 100) % sat.positions.length;
          const currentPos = sat.positions[currentIndex];
          
          const pos = Cartesian3.fromElements(
            currentPos[0] * 1000,
            currentPos[1] * 1000,
            currentPos[2] * 1000
          );
          
          if (!trailsRef.current[sat.name]) {
            trailsRef.current[sat.name] = [];
          }
          trailsRef.current[sat.name].push(pos);
          
          // Trim trail length for performance
          if (trailsRef.current[sat.name].length > 500) {
            trailsRef.current[sat.name].shift();
          }
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [customSatellites]);

  const handleAddSatellite = async () => {
    if (!newTLE.trim() || !newSatelliteName.trim()) {
      alert("Please enter both satellite name and TLE data.");
      return;
    }

    setIsAddingSatellite(true);

    try {
      // Call the backend to add custom satellite
      const response = await axios.post(
        "http://127.0.0.1:8000/api/orbit/satellites/",
        { 
          tle: newTLE,
          satellite_name: newSatelliteName 
        }
      );

      // Get the satellite data from the backend
      const satelliteResponse = await axios.get("http://127.0.0.1:8000/api/orbit/satellites/");
      const satelliteData = satelliteResponse.data.satellites.find(s => s.name === newSatelliteName);
      
      if (!satelliteData) {
        throw new Error("Failed to retrieve satellite data");
      }

      const newSatellite = {
        name: newSatelliteName,
        positions: [], // Will be populated by the backend in real-time
        color: getRandomColor()
      };

      setCustomSatellites(prev => [...prev, newSatellite]);
      setNewTLE("");
      setNewSatelliteName("");
      setIsAddingSatellite(false);
    } catch (error) {
      console.error("Failed to add satellite:", error);
      alert("Failed to add satellite. Please check your TLE data.");
      setIsAddingSatellite(false);
    }
  };

  const handleDeleteSatellite = async (satelliteName) => {
    try {
      // Call backend to delete satellite
      await axios.delete("http://127.0.0.1:8000/api/orbit/satellites/", {
        data: { satellite_name: satelliteName }
      });
      
      // Update local state
      setCustomSatellites(prev => prev.filter(sat => sat.name !== satelliteName));
      
      // Clean up trails
      if (trailsRef.current[satelliteName]) {
        delete trailsRef.current[satelliteName];
      }
    } catch (error) {
      console.error("Failed to delete satellite:", error);
      alert("Failed to delete satellite. Please try again.");
    }
  };

  const getRandomColor = () => {
    const colors = [
      Color.CYAN,
      Color.MAGENTA,
      Color.ORANGE,
      Color.LIME,
      Color.PINK,
      Color.TURQUOISE,
      Color.GOLD,
      Color.CORAL
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // All satellites now come from the backend (no more default satellites)
  const allSatellites = satellites;

  return (
    <div className="orbit-explorer-container">
      {/* Header Section */}
      <section className="explorer-header">
        <h1>🛰️ Real-time Satellite Tracker</h1>
        <p className="explorer-description">
          Live 3D visualization of satellite positions and orbital trails
        </p>
      </section>

      {/* Add Satellite Section */}
      <section className="add-satellite-section">
        <div className="add-satellite-card">
          <h2>📡 Add Custom Satellite</h2>
          <p className="add-satellite-description">
            Enter TLE data to add a custom satellite to the visualization
          </p>
          
          <div className="tle-input-group">
            <div className="input-group">
              <label htmlFor="satelliteName">Satellite Name</label>
              <input
                id="satelliteName"
                type="text"
                placeholder="Enter satellite name"
                value={newSatelliteName}
                onChange={(e) => setNewSatelliteName(e.target.value)}
                className="satellite-input"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="tleData">TLE Data (2 lines)</label>
              <textarea
                id="tleData"
                rows="4"
                placeholder="Enter TLE data (2 lines)&#10;Example:&#10;1 25544U 98067A   21001.50000000  .00000000  00000+0  00000+0 0    04&#10;2 25544  51.6400 114.5000 0000001   0.0000   0.0000 15.48905382    01"
                value={newTLE}
                onChange={(e) => setNewTLE(e.target.value)}
                className="tle-textarea"
              />
            </div>
          </div>

          <button 
            onClick={handleAddSatellite}
            className="add-satellite-button"
            disabled={isAddingSatellite}
          >
            {isAddingSatellite ? (
              <>
                <span className="loading"></span>
                Adding Satellite...
              </>
            ) : (
              <>
                <span className="button-icon">🚀</span>
                Add Satellite
              </>
            )}
          </button>
        </div>
      </section>

      {/* Custom Satellites List */}
      {allSatellites.length > 0 && (
        <section className="custom-satellites-section">
          <div className="custom-satellites-card">
            <h3>🛰️ Active Satellites</h3>
            <div className="satellites-list">
              {allSatellites.map((sat, index) => {
                const colors = [
                  Color.RED, Color.YELLOW, Color.BLUE, Color.CYAN, 
                  Color.MAGENTA, Color.ORANGE, Color.LIME, Color.PINK, 
                  Color.TURQUOISE, Color.GOLD, Color.CORAL
                ];
                const satelliteColor = colors[index % colors.length];
                
                return (
                  <div key={sat.name} className="satellite-item">
                    <div 
                      className="satellite-color" 
                      style={{ backgroundColor: satelliteColor.toCssColorString() }}
                    ></div>
                    <span className="satellite-name">{sat.name}</span>
                    <span className="satellite-trail">
                      Trail: {trailsRef.current[sat.name]?.length || 0} points
                    </span>
                    <button
                      onClick={() => handleDeleteSatellite(sat.name)}
                      className="delete-satellite-button"
                    >
                      <span className="button-icon">🗑️</span>
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Status Section */}
      <section className="status-section">
        <div className="status-card">
          <div className="status-indicators">
            <div className="status-item">
              <span className="status-icon">📡</span>
              <div className="status-content">
                <h3>Total Satellites</h3>
                <p className="status-value">{allSatellites.length}</p>
              </div>
            </div>
            
            <div className="status-item">
              <span className="status-icon">🔄</span>
              <div className="status-content">
                <h3>Update Frequency</h3>
                <p className="status-value">100ms</p>
              </div>
            </div>
            
            <div className="status-item">
              <span className="status-icon">🌍</span>
              <div className="status-content">
                <h3>Coverage</h3>
                <p className="status-value">Global</p>
              </div>
            </div>
          </div>
          
          {isLoading && (
            <div className="loading-status">
              <span className="loading"></span>
              <span>Connecting to satellite network...</span>
            </div>
          )}
          
          {error && (
            <div className="error-status">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      </section>

      {/* Visualization Section */}
      <section className="visualization-section">
        <div className="viewer-container">
          <div className="viewer-header">
            <h2>🌍 Live 3D Visualization</h2>
            <p className="viewer-description">
              Interactive 3D view showing real-time satellite positions and orbital trails
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
              {allSatellites.map((sat, index) => {
                const trailPositions = trailsRef.current[sat.name] || [];
                const currentPosition = Cartesian3.fromElements(
                  sat.position[0] * 1000,
                  sat.position[1] * 1000,
                  sat.position[2] * 1000
                );
                
                // Generate a consistent color based on satellite name
                const colors = [
                  Color.RED, Color.YELLOW, Color.BLUE, Color.CYAN, 
                  Color.MAGENTA, Color.ORANGE, Color.LIME, Color.PINK, 
                  Color.TURQUOISE, Color.GOLD, Color.CORAL
                ];
                const satelliteColor = colors[index % colors.length];

                return (
                  <Entity
                    key={sat.name}
                    name={sat.name}
                    position={currentPosition}
                    point={{ pixelSize: 15, color: satelliteColor }}
                    description={`Position: ${sat.position ? sat.position.map((p) => p.toFixed(2)).join(", ") : "Custom satellite"}`}
                  >
                    {trailPositions.length >= 2 && (
                      <Entity
                        polyline={{
                          positions: new CallbackProperty(() => trailPositions, false),
                          width: 3,
                          material: satelliteColor,
                        }}
                      />
                    )}
                  </Entity>
                );
              })}
            </Viewer>
          </div>
          
          {/* Legend */}
          <div className="viewer-legend">
            <h3>Satellite Legend</h3>
            <div className="legend-items">
              {allSatellites.map((sat, index) => {
                const colors = [
                  Color.RED, Color.YELLOW, Color.BLUE, Color.CYAN, 
                  Color.MAGENTA, Color.ORANGE, Color.LIME, Color.PINK, 
                  Color.TURQUOISE, Color.GOLD, Color.CORAL
                ];
                const satelliteColor = colors[index % colors.length];
                
                return (
                  <div key={sat.name} className="legend-item">
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: satelliteColor.toCssColorString() }}
                    ></div>
                    <span className="legend-label">{sat.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-card">
          <h2>📊 Real-time Data</h2>
          <p>
            This visualization shows live satellite positions updated every 100ms. 
            The colored trails represent the orbital paths of each satellite over time. 
            You can add custom satellites using TLE data or remove them as needed.
          </p>
          <div className="info-features">
            <div className="info-feature">
              <span className="feature-icon">🎯</span>
              <span>Real-time positioning</span>
            </div>
            <div className="info-feature">
              <span className="feature-icon">📈</span>
              <span>Orbital trail tracking</span>
            </div>
            <div className="info-feature">
              <span className="feature-icon">🌐</span>
              <span>3D visualization</span>
            </div>
            <div className="info-feature">
              <span className="feature-icon">➕</span>
              <span>Add custom satellites</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrbitExplorer;