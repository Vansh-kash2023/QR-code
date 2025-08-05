import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';
import './FacultyList.css';

const FacultyList = () => {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [departments, setDepartments] = useState([]);

  const { facultyStatuses } = useSocket();

  const statusConfig = {
    0: { name: 'Available', color: '#4CAF50', icon: '✅' },
    1: { name: 'Busy', color: '#F44336', icon: '🔴' },
    2: { name: 'Away', color: '#FF9800', icon: '🟡' },
    3: { name: 'Offline', color: '#9E9E9E', icon: '⚫' }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    // Update faculty list with real-time status changes
    const updatedFaculty = faculty.map(f => {
      const realtimeStatus = facultyStatuses[f.id];
      if (realtimeStatus) {
        return {
          ...f,
          status: realtimeStatus.code,
          status_message: realtimeStatus.name,
          status_updated_at: realtimeStatus.updated_at
        };
      }
      return f;
    });

    if (JSON.stringify(updatedFaculty) !== JSON.stringify(faculty)) {
      setFaculty(updatedFaculty);
    }
  }, [facultyStatuses]);

  useEffect(() => {
    filterFaculty();
  }, [faculty, searchTerm, statusFilter, departmentFilter]);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/faculty');
      const facultyData = response.data.faculty;
      
      setFaculty(facultyData);
      
      // Extract unique departments
      const uniqueDepartments = [...new Set(facultyData.map(f => f.department))];
      setDepartments(uniqueDepartments.sort());
      
      setError('');
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
      setError('Failed to load faculty list');
    } finally {
      setLoading(false);
    }
  };

  const filterFaculty = () => {
    let filtered = faculty;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.office_location && f.office_location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(f => f.status === parseInt(statusFilter));
    }

    // Filter by department
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(f => f.department === departmentFilter);
    }

    setFilteredFaculty(filtered);
  };

  const getStatusConfig = (statusCode) => {
    return statusConfig[statusCode] || statusConfig[3];
  };

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusStats = () => {
    const stats = faculty.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: faculty.length,
      available: stats[0] || 0,
      busy: stats[1] || 0,
      away: stats[2] || 0,
      offline: stats[3] || 0
    };
  };

  if (loading) {
    return (
      <div className="faculty-list">
        <div className="faculty-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading faculty list...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faculty-list">
        <div className="faculty-container">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={fetchFaculty} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="faculty-list">
      <div className="faculty-container">
        <div className="faculty-header">
          <h1>Faculty Availability Directory</h1>
          <p>View real-time availability status of all faculty members. Click on any faculty member to check their detailed status or scan their QR code.</p>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Faculty</div>
          </div>
          <div className="stat-card available">
            <div className="stat-number">{stats.available}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card busy">
            <div className="stat-number">{stats.busy}</div>
            <div className="stat-label">Busy</div>
          </div>
          <div className="stat-card away">
            <div className="stat-number">{stats.away}</div>
            <div className="stat-label">Away</div>
          </div>
          <div className="stat-card offline">
            <div className="stat-number">{stats.offline}</div>
            <div className="stat-label">Offline</div>
          </div>
        </div>

        <div className="faculty-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search faculty by name, department, or office..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="0">Available Only</option>
              <option value="1">Busy Only</option>
              <option value="2">Away Only</option>
              <option value="3">Offline Only</option>
            </select>

            <select 
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredFaculty.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No faculty found</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="faculty-grid">
            {filteredFaculty.map((f) => {
              const statusInfo = getStatusConfig(f.status);
              return (
                <div key={f.id} className="faculty-card">
                  <div className="faculty-avatar">
                    {f.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="faculty-info">
                    <h3 className="faculty-name">{f.name}</h3>
                    <p className="faculty-department">{f.department}</p>
                    {f.office_location && (
                      <p className="faculty-office">📍 {f.office_location}</p>
                    )}
                  </div>

                  <div className="faculty-status">
                    <div 
                      className="status-indicator"
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.icon}
                    </div>
                    <div className="status-details">
                      <span className="status-name" style={{ color: statusInfo.color }}>
                        {statusInfo.name}
                      </span>
                      <span className="status-time">
                        {formatLastUpdate(f.status_updated_at)}
                      </span>
                    </div>
                  </div>

                  <div className="faculty-actions">
                    <Link 
                      to={`/check/${f.id}`} 
                      className="action-btn primary"
                    >
                      Check Status
                    </Link>
                    <Link 
                      to={`/qr/${f.id}`} 
                      className="action-btn secondary"
                    >
                      QR Code
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="faculty-footer">
          <div className="real-time-indicator">
            <span className="indicator-dot"></span>
            Real-time updates enabled
          </div>
          <p>This page automatically updates when faculty members change their status. Status information is refreshed in real-time via WebSocket connections.</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyList;
