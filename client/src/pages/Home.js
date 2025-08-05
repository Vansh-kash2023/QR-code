import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            QR-Enabled Faculty Availability System
          </h1>
          <p className="hero-subtitle">
            Real-time faculty availability with binary status encoding.<br />
            Scan QR codes to instantly check if your professors are available for consultation.
          </p>
          
          <div className="hero-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
                <Link to={`/qr/${user?.id}`} className="btn btn-secondary">
                  View My QR Code
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Faculty Login
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register as Faculty
                </Link>
              </>
            )}
            <Link to="/faculty" className="btn btn-outline">
              Browse Faculty
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="qr-demo">
            <div className="qr-placeholder">
              <div className="qr-pattern">
                <div className="qr-corner tl"></div>
                <div className="qr-corner tr"></div>
                <div className="qr-corner bl"></div>
                <div className="qr-corner br"></div>
                <div className="qr-center"></div>
              </div>
            </div>
            <p className="qr-demo-text">Sample QR Code</p>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-time Updates</h3>
              <p>Get instant notifications when faculty availability status changes via WebSocket connections.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>QR Code Integration</h3>
              <p>Each faculty member has a unique QR code that links directly to their current availability status.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔢</div>
              <h3>Binary Status Encoding</h3>
              <p>Efficient binary encoding system: Available (00), Busy (01), Away (10), Offline (11).</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🖥️</div>
              <h3>Faculty Dashboard</h3>
              <p>Easy-to-use interface for faculty to update their availability status and manage their profile.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Quick Status Check</h3>
              <p>Students can instantly check faculty availability by scanning QR codes or browsing the faculty list.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Responsive</h3>
              <p>Works seamlessly on all devices - desktop, tablet, and mobile phones.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="status-section">
        <div className="container">
          <h2 className="section-title">Status Indicators</h2>
          <div className="status-grid">
            <div className="status-card available">
              <div className="status-indicator"></div>
              <div className="status-info">
                <h3>Available</h3>
                <p>Binary: 00 | Ready for consultation</p>
              </div>
            </div>
            
            <div className="status-card busy">
              <div className="status-indicator"></div>
              <div className="status-info">
                <h3>Busy</h3>
                <p>Binary: 01 | Currently occupied</p>
              </div>
            </div>
            
            <div className="status-card away">
              <div className="status-indicator"></div>
              <div className="status-info">
                <h3>Away</h3>
                <p>Binary: 10 | Temporarily unavailable</p>
              </div>
            </div>
            
            <div className="status-card offline">
              <div className="status-indicator"></div>
              <div className="status-info">
                <h3>Offline</h3>
                <p>Binary: 11 | Not available today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
