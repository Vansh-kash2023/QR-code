const db = require('./models/database');

const sampleFaculty = [
  {
    faculty_id: 'FAC001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    department: 'Computer Science',
    office_location: 'CS Building, Room 301',
    phone: '+1-555-0101',
    password: 'password123'
  },
  {
    faculty_id: 'FAC002',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    department: 'Computer Science',
    office_location: 'CS Building, Room 205',
    phone: '+1-555-0102',
    password: 'password123'
  },
  {
    faculty_id: 'FAC003',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    department: 'Mathematics',
    office_location: 'Math Building, Room 410',
    phone: '+1-555-0103',
    password: 'password123'
  },
  {
    faculty_id: 'FAC004',
    name: 'Prof. David Thompson',
    email: 'david.thompson@university.edu',
    department: 'Physics',
    office_location: 'Physics Building, Room 102',
    phone: '+1-555-0104',
    password: 'password123'
  },
  {
    faculty_id: 'FAC005',
    name: 'Dr. Lisa Wang',
    email: 'lisa.wang@university.edu',
    department: 'Computer Science',
    office_location: 'CS Building, Room 315',
    phone: '+1-555-0105',
    password: 'password123'
  },
  {
    faculty_id: 'FAC006',
    name: 'Prof. Robert Miller',
    email: 'robert.miller@university.edu',
    department: 'Engineering',
    office_location: 'Engineering Building, Room 501',
    phone: '+1-555-0106',
    password: 'password123'
  },
  {
    faculty_id: 'FAC007',
    name: 'Dr. Jennifer Brown',
    email: 'jennifer.brown@university.edu',
    department: 'Mathematics',
    office_location: 'Math Building, Room 220',
    phone: '+1-555-0107',
    password: 'password123'
  },
  {
    faculty_id: 'FAC008',
    name: 'Prof. James Wilson',
    email: 'james.wilson@university.edu',
    department: 'Physics',
    office_location: 'Physics Building, Room 315',
    phone: '+1-555-0108',
    password: 'password123'
  },
  {
    faculty_id: 'FAC009',
    name: 'Dr. Amanda Davis',
    email: 'amanda.davis@university.edu',
    department: 'Engineering',
    office_location: 'Engineering Building, Room 203',
    phone: '+1-555-0109',
    password: 'password123'
  },
  {
    faculty_id: 'FAC010',
    name: 'Prof. Kevin Lee',
    email: 'kevin.lee@university.edu',
    department: 'Computer Science',
    office_location: 'CS Building, Room 425',
    phone: '+1-555-0110',
    password: 'password123'
  }
];

const sampleStatuses = [
  { faculty_id: 'FAC001', status: '00', notes: 'Office hours until 4 PM' },
  { faculty_id: 'FAC002', status: '01', notes: 'In meeting until 3:30 PM' },
  { faculty_id: 'FAC003', status: '00', notes: 'Available for student consultation' },
  { faculty_id: 'FAC004', status: '10', notes: 'At conference, back tomorrow' },
  { faculty_id: 'FAC005', status: '01', notes: 'Teaching lab session' },
  { faculty_id: 'FAC006', status: '00', notes: 'Drop by anytime' },
  { faculty_id: 'FAC007', status: '11', notes: 'Off campus today' },
  { faculty_id: 'FAC008', status: '00', notes: 'Available for research discussions' },
  { faculty_id: 'FAC009', status: '01', notes: 'Student meetings until 5 PM' },
  { faculty_id: 'FAC010', status: '10', notes: 'In departmental meeting' }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize database first
    await db.initialize();

    // Create faculty members
    console.log('Creating faculty members...');
    for (const faculty of sampleFaculty) {
      try {
        await db.createFaculty(faculty);
        console.log(`✅ Created faculty: ${faculty.name}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  Faculty already exists: ${faculty.name}`);
        } else {
          console.error(`❌ Error creating faculty ${faculty.name}:`, error.message);
        }
      }
    }

    // Set initial statuses
    console.log('\nSetting initial faculty statuses...');
    for (const statusData of sampleStatuses) {
      try {
        await db.updateFacultyStatus(
          statusData.faculty_id,
          statusData.status,
          statusData.notes
        );
        console.log(`✅ Set status for ${statusData.faculty_id}: ${statusData.status}`);
      } catch (error) {
        console.error(`❌ Error setting status for ${statusData.faculty_id}:`, error.message);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    
    // Display summary
    const allFaculty = await db.getAllFaculty();
    console.log(`\n📊 Summary:`);
    console.log(`   - Total Faculty: ${allFaculty.length}`);
    
    const statusCounts = allFaculty.reduce((acc, faculty) => {
      const status = faculty.current_status || '11';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`   - Available (00): ${statusCounts['00'] || 0}`);
    console.log(`   - Busy (01): ${statusCounts['01'] || 0}`);
    console.log(`   - Away (10): ${statusCounts['10'] || 0}`);
    console.log(`   - Offline (11): ${statusCounts['11'] || 0}`);
    
    console.log('\n🚀 Your Faculty Availability System is ready to use!');
    console.log('\nDefault login credentials for testing:');
    console.log('   Email: sarah.johnson@university.edu');
    console.log('   Password: password123');
    console.log('\n   (All sample faculty use password: password123)');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedDatabase, sampleFaculty, sampleStatuses };
