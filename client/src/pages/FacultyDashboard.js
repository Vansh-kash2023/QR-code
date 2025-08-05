import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';
import './Dashboard.css';

const FacultyDashboard = () => {
  const { user, isAuthenticated, updateUserStatus } = useAuth();
  const { emitStatusUpdate } = useSocket();
  const [currentStatus, setCurrentStatus] = useState({
    code: 0,
    name: 'Available',
    message: '',
    color: '#4CAF50'
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const statusOptions = [
    { code: 0, name: 'Available', binary: '00', color: '#4CAF50', icon: '✅' },
    { code: 1, name: 'Busy', binary: '01', color: '#F44336', icon: '🔴' },
    { code: 2, name: 'Away', binary: '10', color: '#FF9800', icon: '🟡' },
    { code: 3, name: 'Offline', binary: '11', color: '#9E9E9E', icon: '⚫' }
  ];

  useEffect(() => {
    if (user) {
      const status = statusOptions.find(s => s.code === user.status) || statusOptions[0];
      setCurrentStatus(status);
      setStatusMessage(user.status_message || '');
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(`/status/${user.id}`, {
        status: newStatus.code,
        message: statusMessage
      });

      const updatedStatus = {
        ...newStatus,
        message: statusMessage,
        updated_at: response.data.status.updated_at
      };

      setCurrentStatus(updatedStatus);
      updateUserStatus(updatedStatus);
      
      // Emit real-time update
      emitStatusUpdate(user.id, updatedStatus);
      
      setSuccess('Status updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      console.error('Status update error:', err);
      setError(err.response?.data?.error || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Good {getTimeOfDay()}, {user?.name}!</h1>
            <p>Manage your availability status and help students plan their visits efficiently.</p>
          </div>
          
          <div className="current-status-display">
            <div 
              className="status-indicator-large"
              style={{ backgroundColor: currentStatus.color }}
            >
              {statusOptions.find(s => s.code === currentStatus.code)?.icon}
            </div>
            <div className="status-info">
              <h3>Current Status</h3>
              <p className="status-name">{currentStatus.name}</p>
              <p className="status-binary">Binary: {statusOptions.find(s => s.code === currentStatus.code)?.binary}</p>
              <p className="last-update">
                Last updated: {formatLastUpdate(user?.status_updated_at)}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            {success}
          </div>
        )}

        <div className="dashboard-content">
          <div className="status-update-section">
            <h2>Update Your Status</h2>
            
            <div className="status-options">
              {statusOptions.map((status) => (
                <button
                  key={status.code}
                  className={`status-option ${currentStatus.code === status.code ? 'active' : ''}`}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={loading}
                  style={{ 
                    borderColor: status.color,
                    backgroundColor: currentStatus.code === status.code ? status.color : 'transparent',
                    color: currentStatus.code === status.code ? 'white' : status.color
                  }}
                >
                  <div className="status-option-content">
                    <span className="status-icon">{status.icon}</span>
                    <div className="status-details">
                      <span className="status-name">{status.name}</span>
                      <span className="status-binary">Binary: {status.binary}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="status-message-section">
              <label htmlFor="statusMessage">Status Message (Optional)</label>
              <textarea
                id="statusMessage"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="Add a custom message about your availability..."
                rows="3"
                maxLength="200"
                disabled={loading}
              />
              <small>{statusMessage.length}/200 characters</small>
            </div>
          </div>

          <div className="dashboard-stats">
            <h2>Your Information</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏫</div>
                <div className="stat-info">
                  <h3>Department</h3>
                  <p>{user?.department}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📍</div>
                <div className="stat-info">
                  <h3>Office Location</h3>
                  <p>{user?.office_location || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📧</div>
                <div className="stat-info">
                  <h3>Email</h3>
                  <p>{user?.email}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📱</div>
                <div className="stat-info">
                  <h3>Phone</h3>
                  <p>{user?.phone || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <a 
                href={`/qr/${user?.id}`} 
                className="action-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="action-icon">📱</div>
                <div className="action-info">
                  <h3>View QR Code</h3>
                  <p>Share your QR code with students</p>
                </div>
              </a>
              
              <a 
                href={`/check/${user?.id}`} 
                className="action-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="action-icon">👁️</div>
                <div className="action-info">
                  <h3>Preview Status Page</h3>
                  <p>See what students see when they check your status</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
