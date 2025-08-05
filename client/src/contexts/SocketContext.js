import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [facultyStatuses, setFacultyStatuses] = useState({});

  const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      cors: {
        origin: window.location.origin,
        methods: ["GET", "POST"]
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    // Listen for faculty status updates
    newSocket.on('faculty_status_update', (data) => {
      console.log('Faculty status update received:', data);
      setFacultyStatuses(prev => ({
        ...prev,
        [data.facultyId]: data.status
      }));
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [SERVER_URL]);

  const joinFacultyRoom = (facultyId) => {
    if (socket && connected) {
      socket.emit('join_faculty_room', facultyId);
    }
  };

  const emitStatusUpdate = (facultyId, status) => {
    if (socket && connected) {
      socket.emit('status_update', {
        facultyId,
        status,
        timestamp: new Date().toISOString()
      });
    }
  };

  const value = {
    socket,
    connected,
    facultyStatuses,
    joinFacultyRoom,
    emitStatusUpdate,
    setFacultyStatuses
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
