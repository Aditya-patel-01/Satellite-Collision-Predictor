import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import CollisionLab from "./pages/CollisionLab";
import OrbitExplorer from "./pages/OrbitExplorer";
import About from "./pages/About";

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: "🚀" },
    { path: "/collision", label: "CollisionLab", icon: "💥" },
    { path: "/orbit", label: "OrbitExplorer", icon: "🛰️" },
    { path: "/about", label: "About", icon: "ℹ️" }
  ];

  return (
    <nav className="space-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-icon">🌌</span>
          <span className="brand-text">SCP</span>
        </div>
        
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collision" element={<CollisionLab />} />
            <Route path="/orbit" element={<OrbitExplorer />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}













































