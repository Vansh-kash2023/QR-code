const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, '../../database/faculty_availability.db');
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const queries = [
        `CREATE TABLE IF NOT EXISTS faculty (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          faculty_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          department TEXT NOT NULL,
          office_location TEXT,
          phone TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        `CREATE TABLE IF NOT EXISTS faculty_status (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          faculty_id TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT '11',
          notes TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (faculty_id) REFERENCES faculty (faculty_id) ON DELETE CASCADE
        )`
      ];

      // Execute queries sequentially
      const executeQuery = (index) => {
        if (index >= queries.length) {
          console.log('All database tables created successfully');
          resolve();
          return;
        }

        this.db.run(queries[index], (err) => {
          if (err) {
            console.error(`Error creating table ${index}:`, err);
            reject(err);
          } else {
            executeQuery(index + 1);
          }
        });
      };

      executeQuery(0);
    });
  }

  // Faculty management methods
  async createFaculty(facultyData) {
    const { faculty_id, name, email, password, department, office_location, phone } = facultyData;
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO faculty (faculty_id, name, email, password, department, office_location, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(query, [faculty_id, name, email, hashedPassword, department, office_location, phone], function(err) {
        if (err) {
          reject(err);
        } else {
          // Create initial status entry
          const statusQuery = `
            INSERT INTO faculty_status (faculty_id, status, notes)
            VALUES (?, '11', 'Offline')
          `;
          
          db.db.run(statusQuery, [faculty_id], (statusErr) => {
            if (statusErr) {
              console.error('Error creating initial status:', statusErr);
            }
          });
          
          resolve({ faculty_id, ...facultyData });
        }
      });
    });
  }

  async getFacultyByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT f.*, fs.status, fs.notes as status_message, fs.updated_at as status_updated_at
        FROM faculty f
        LEFT JOIN faculty_status fs ON f.faculty_id = fs.faculty_id
        WHERE f.email = ?
      `;
      
      this.db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getFacultyById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT f.*, fs.status, fs.notes as status_message, fs.updated_at as status_updated_at
        FROM faculty f
        LEFT JOIN faculty_status fs ON f.faculty_id = fs.faculty_id
        WHERE f.faculty_id = ?
      `;
      
      this.db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async updateFacultyStatus(facultyId, status, notes = null) {
    return new Promise((resolve, reject) => {
      // Check if status record exists
      const checkQuery = `SELECT * FROM faculty_status WHERE faculty_id = ?`;
      
      this.db.get(checkQuery, [facultyId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row) {
          // Update existing status
          const updateQuery = `
            UPDATE faculty_status 
            SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE faculty_id = ?
          `;
          
          this.db.run(updateQuery, [status, notes, facultyId], (updateErr) => {
            if (updateErr) {
              reject(updateErr);
            } else {
              resolve({ facultyId, status, notes, timestamp: new Date().toISOString() });
            }
          });
        } else {
          // Create new status record
          const insertQuery = `
            INSERT INTO faculty_status (faculty_id, status, notes)
            VALUES (?, ?, ?)
          `;
          
          this.db.run(insertQuery, [facultyId, status, notes], (insertErr) => {
            if (insertErr) {
              reject(insertErr);
            } else {
              resolve({ facultyId, status, notes, timestamp: new Date().toISOString() });
            }
          });
        }
      });
    });
  }

  async getFacultyStatus(facultyId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT fs.*, f.name, f.department, f.office_location
        FROM faculty_status fs
        JOIN faculty f ON fs.faculty_id = f.faculty_id
        WHERE fs.faculty_id = ?
      `;
      
      this.db.get(query, [facultyId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getAllFaculty() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT f.faculty_id, f.name, f.email, f.department, f.office_location, f.phone,
               fs.status as current_status, fs.notes as status_message, fs.updated_at as status_updated_at
        FROM faculty f
        LEFT JOIN faculty_status fs ON f.faculty_id = fs.faculty_id
        ORDER BY f.name
      `;
      
      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

const db = new Database();

module.exports = db;
