import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <h1>🏫 Faculty Availability</h1>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/faculty" className="nav-link">Faculty List</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {user && (
                <Link to={`/qr/${user.id}`} className="nav-link">My QR Code</Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Faculty Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>

        <div className="header-right">
          <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {connected ? 'Live' : 'Offline'}
          </div>

          {isAuthenticated && user && (
            <div className="user-info">
              <span className="user-name">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
