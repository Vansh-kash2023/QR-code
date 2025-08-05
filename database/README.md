# Database Directory

This directory contains the SQLite database files for the Faculty Availability System.

## Files

- `faculty_availability.db` - Main database file (auto-generated)
- `backup/` - Database backup files (if any)

## Database Schema

### Tables

1. **faculty**
   - id (INTEGER PRIMARY KEY)
   - name (TEXT NOT NULL)
   - email (TEXT UNIQUE NOT NULL)
   - password (TEXT NOT NULL)
   - department (TEXT NOT NULL)
   - office_location (TEXT)
   - phone (TEXT)
   - created_at (DATETIME)
   - updated_at (DATETIME)

2. **faculty_status**
   - id (INTEGER PRIMARY KEY)
   - faculty_id (INTEGER FOREIGN KEY)
   - status (INTEGER NOT NULL) - Binary encoded status
   - message (TEXT)
   - updated_at (DATETIME)

3. **status_history**
   - id (INTEGER PRIMARY KEY)
   - faculty_id (INTEGER FOREIGN KEY)
   - status (INTEGER NOT NULL)
   - message (TEXT)
   - timestamp (DATETIME)

## Status Encoding

The system uses binary encoding for efficient status representation:

- `0` (Binary: 00) - Available (Green)
- `1` (Binary: 01) - Busy (Red)
- `2` (Binary: 10) - Away (Orange)
- `3` (Binary: 11) - Offline (Gray)

## Backup Strategy

- Regular automated backups
- Manual backup before major updates
- Backup retention policy: 30 days
