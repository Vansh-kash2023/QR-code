# QR-Enabled Faculty Availability System

A comprehensive real-time faculty availability indicator system that leverages binary status encoding to help students check faculty availability and reduce unproductive campus visits.

## 🎯 Project Overview

This system enables students to quickly check faculty availability through QR codes or a web interface, while allowing faculty members to update their status in real-time. The system uses efficient binary encoding (2-bit status representation) and WebSocket communication for instant updates.

## 🚀 Features

### For Students
- **QR Code Scanning**: Quickly check faculty availability by scanning QR codes
- **Real-time Status Updates**: See live status changes without page refresh
- **Faculty Directory**: Browse all faculty with search and filter capabilities
- **Status History**: View when faculty status was last updated
- **Responsive Design**: Works seamlessly on mobile and desktop devices

### For Faculty
- **Real-time Status Management**: Update availability status instantly
- **QR Code Generation**: Generate personalized QR codes for office doors
- **Status Analytics**: View status change history and patterns
- **Secure Authentication**: JWT-based authentication system
- **Dashboard Interface**: Intuitive interface for status management

### System Features
- **Binary Status Encoding**: Efficient 2-bit status system (Available/Busy/Away/Offline)
- **WebSocket Communication**: Real-time updates using Socket.io
- **RESTful API**: Comprehensive API for all system operations
- **SQLite Database**: Lightweight, embedded database solution
- **Security**: Rate limiting, input validation, and secure authentication

## 📊 Status Encoding System

| Binary Code | Status | Description | Color |
|-------------|--------|-------------|--------|
| `00` | Available | Ready for student interaction | 🟢 Green |
| `01` | Busy | In meeting or occupied | 🔴 Red |
| `10` | Away | Temporarily unavailable | 🟡 Orange |
| `11` | Offline | Not available today | ⚫ Gray |

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time**: Socket.io
- **Security**: bcrypt, helmet, express-rate-limit
- **QR Generation**: qrcode library

### Frontend
- **Framework**: React.js (Hooks)
- **Routing**: React Router
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Styling**: CSS3 with responsive design
- **State Management**: React Context API

## 📁 Project Structure

```
QR-code/
├── server/                 # Backend application
│   ├── models/
│   │   └── database.js     # Database models and operations
│   ├── routes/
│   │   ├── faculty.js      # Faculty authentication routes
│   │   ├── status.js       # Status management routes
│   │   └── qr.js           # QR code generation routes
│   ├── middleware/
│   │   └── auth.js         # Authentication middleware
│   ├── index.js            # Main server file
│   ├── seed.js             # Database seeding script
│   └── .env                # Environment configuration
├── client/                 # Frontend application
│   ├── public/
│   ├── src/
│   │   ├── contexts/
│   │   │   ├── AuthContext.js    # Authentication context
│   │   │   └── SocketContext.js  # WebSocket context
│   │   ├── pages/
│   │   │   ├── Home.js           # Landing page
│   │   │   ├── Login.js          # Faculty login
│   │   │   ├── Register.js       # Faculty registration
│   │   │   ├── FacultyDashboard.js # Faculty dashboard
│   │   │   ├── StatusCheck.js    # Status checking page
│   │   │   ├── QRGenerator.js    # QR code generation
│   │   │   └── FacultyList.js    # Faculty directory
│   │   ├── App.js                # Main app component
│   │   └── index.js              # React entry point
│   └── .env                      # Frontend environment
├── package.json            # Project dependencies and scripts
├── setup.bat               # Windows setup script
├── setup.sh                # Unix setup script
└── README.md               # Project documentation
```

## � Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QR-code
   ```

2. **Run automated setup (Windows)**
   ```bash
   setup.bat
   ```

3. **Or run automated setup (Unix/Mac)**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

### Manual Setup

1. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in both server and client directories
   - Update configuration values as needed

4. **Initialize database and seed data**
   ```bash
   cd ../server
   node seed.js
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server will run on http://localhost:5000

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   ```
   Client will run on http://localhost:3000

## 🔐 Default Credentials

The system comes with sample faculty data for testing:

| Email | Password | Department |
|-------|----------|------------|
| sarah.johnson@university.edu | password123 | Computer Science |
| michael.chen@university.edu | password123 | Computer Science |
| emily.rodriguez@university.edu | password123 | Mathematics |
| david.thompson@university.edu | password123 | Physics |

*Note: Change these credentials in production!*

## � API Documentation

### Authentication Endpoints
- `POST /api/faculty/register` - Register new faculty
- `POST /api/faculty/login` - Faculty login
- `GET /api/faculty/profile` - Get faculty profile (authenticated)

### Status Management
- `GET /api/status/faculty/:id` - Get faculty current status
- `PUT /api/status/faculty/:id` - Update faculty status (authenticated)
- `GET /api/status/history/:id` - Get status history
- `GET /api/status/all` - Get all faculty statuses

### QR Code Generation
- `GET /api/qr/faculty/:id` - Generate QR code for faculty
- `GET /api/qr/faculty/:id/formats` - Get QR code in multiple formats

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database.sqlite
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
```

#### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_QR_BASE_URL=http://localhost:3000/check
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Manual Testing Checklist
- [ ] Faculty registration and login
- [ ] Status updates in real-time
- [ ] QR code generation and scanning
- [ ] WebSocket connectivity
- [ ] Mobile responsiveness
- [ ] API error handling

## 🚀 Deployment

### Production Build
```bash
# Build frontend for production
cd client
npm run build

# Start production server
cd ../server
NODE_ENV=production npm start
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Sanitizes all user inputs
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Development Team** - Initial work and system architecture

## 🙏 Acknowledgments

- University faculty for system requirements and feedback
- Students for usability testing and suggestions
- Open source community for the amazing libraries and tools

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Made with ❤️ for efficient campus communication**