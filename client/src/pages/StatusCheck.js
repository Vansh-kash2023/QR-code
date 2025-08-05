import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';
import './StatusCheck.css';

const StatusCheck = () => {
  const { facultyId } = useParams();
  const { facultyStatuses, joinFacultyRoom } = useSocket();
  const [faculty, setFaculty] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const statusConfig = {
    0: { name: 'Available', binary: '00', color: '#4CAF50', icon: '✅', message: 'Ready for consultation' },
    1: { name: 'Busy', binary: '01', color: '#F44336', icon: '🔴', message: 'Currently occupied' },
    2: { name: 'Away', binary: '10', color: '#FF9800', icon: '🟡', message: 'Temporarily unavailable' },
    3: { name: 'Offline', binary: '11', color: '#9E9E9E', icon: '⚫', message: 'Not available today' }
  };

  useEffect(() => {
    fetchFacultyStatus();
    
    if (facultyId) {
      joinFacultyRoom(facultyId);
    }
  }, [facultyId, joinFacultyRoom]);

  // Listen for real-time status updates
  useEffect(() => {
    const facultyStatus = facultyStatuses[facultyId];
    if (facultyStatus && status) {
      setStatus(prevStatus => ({
        ...prevStatus,
        ...facultyStatus
      }));
      setLastRefresh(new Date());
    }
  }, [facultyStatuses, facultyId, status]);

  const fetchFacultyStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/status/${facultyId}`);
      
      setFaculty(response.data.faculty);
      setStatus(response.data.status);
      setLastRefresh(new Date());
      setError('');
      
    } catch (err) {
      console.error('Failed to fetch faculty status:', err);
      setError(
        err.response?.status === 404 
          ? 'Faculty member not found' 
          : 'Failed to load status information'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchFacultyStatus();
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusConfig = (statusCode) => {
    return statusConfig[statusCode] || statusConfig[3];
  };

  if (loading) {
    return (
      <div className="status-check">
        <div className="status-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading faculty status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-check">
        <div className="status-container">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusConfig = getStatusConfig(status?.code);

  return (
    <div className="status-check">
      <div className="status-container">
        <div className="faculty-header">
          <div className="faculty-avatar">
            {faculty?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="faculty-info">
            <h1>{faculty?.name}</h1>
            <p className="department">{faculty?.department}</p>
            {faculty?.office_location && (
              <p className="office">📍 {faculty?.office_location}</p>
            )}
          </div>
        </div>

        <div className="status-display">
          <div 
            className="status-indicator-main"
            style={{ backgroundColor: currentStatusConfig.color }}
          >
            <span className="status-icon">{currentStatusConfig.icon}</span>
          </div>
          
          <div className="status-details">
            <h2 className="status-name" style={{ color: currentStatusConfig.color }}>
              {currentStatusConfig.name}
            </h2>
            <p className="status-description">{currentStatusConfig.message}</p>
            
            <div className="status-meta">
              <div className="meta-item">
                <span className="meta-label">Binary Code:</span>
                <span className="meta-value binary-code">{currentStatusConfig.binary}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Last Updated:</span>
                <span className="meta-value">{formatTimestamp(status?.updated_at)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Page Refreshed:</span>
                <span className="meta-value">{formatTimestamp(lastRefresh)}</span>
              </div>
            </div>

            {status?.message && (
              <div className="custom-message">
                <h3>Additional Information:</h3>
                <p>{status.message}</p>
              </div>
            )}
          </div>
        </div>

        <div className="status-legend">
          <h3>Status Legend</h3>
          <div className="legend-grid">
            {Object.entries(statusConfig).map(([code, config]) => (
              <div 
                key={code}
                className={`legend-item ${parseInt(code) === status?.code ? 'current' : ''}`}
              >
                <div 
                  className="legend-indicator"
                  style={{ backgroundColor: config.color }}
                >
                  {config.icon}
                </div>
                <div className="legend-info">
                  <span className="legend-name">{config.name}</span>
                  <span className="legend-binary">({config.binary})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleRefresh} className="refresh-btn">
            🔄 Refresh Status
          </button>
          <button 
            onClick={() => window.location.href = '/faculty'} 
            className="browse-btn"
          >
            👥 Browse All Faculty
          </button>
        </div>

        <div className="system-info">
          <div className="real-time-indicator">
            <span className="indicator-dot"></span>
            Real-time updates enabled
          </div>
          <p className="system-note">
            This page automatically updates when the faculty member changes their status.
            QR code generated from Faculty Availability System.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusCheck;
