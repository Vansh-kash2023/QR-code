import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyLogin from './pages/FacultyLogin';
import FacultyRegister from './pages/FacultyRegister';
import StatusCheck from './pages/StatusCheck';
import QRGenerator from './pages/QRGenerator';
import FacultyList from './pages/FacultyList';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<FacultyDashboard />} />
                <Route path="/login" element={<FacultyLogin />} />
                <Route path="/register" element={<FacultyRegister />} />
                <Route path="/check/:facultyId" element={<StatusCheck />} />
                <Route path="/qr/:facultyId" element={<QRGenerator />} />
                <Route path="/faculty" element={<FacultyList />} />
              </Routes>
            </main>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
