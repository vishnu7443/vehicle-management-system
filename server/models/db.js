const { query, initDatabaseConnection, getIsPostgres } = require('../config/database');
const bcrypt = require('bcryptjs');

const setupDatabase = async () => {
  await initDatabaseConnection();

  const isPg = getIsPostgres();
  console.log('🔄 Initializing DB schema and seed data...');

  try {
    if (isPg) {
      // PostgreSQL Table Creation
      await query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'Staff',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_number VARCHAR(50) UNIQUE NOT NULL,
            vehicle_name VARCHAR(100) NOT NULL,
            brand VARCHAR(100) NOT NULL,
            model VARCHAR(100) NOT NULL,
            type VARCHAR(50) NOT NULL,
            fuel VARCHAR(50) NOT NULL,
            manufacturing_year INT NOT NULL,
            registration_date DATE NOT NULL,
            status VARCHAR(50) DEFAULT 'Active',
            created_by INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else {
      // SQLite Table Creation
      await query(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'Staff',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vehicle_number TEXT UNIQUE NOT NULL,
            vehicle_name TEXT NOT NULL,
            brand TEXT NOT NULL,
            model TEXT NOT NULL,
            type TEXT NOT NULL,
            fuel TEXT NOT NULL,
            manufacturing_year INTEGER NOT NULL,
            registration_date TEXT NOT NULL,
            status TEXT DEFAULT 'Active',
            created_by INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // Seed Admin & Staff Users if empty
    const userCheck = await query('SELECT COUNT(*) as count FROM users');
    const userCount = parseInt(userCheck.rows[0].count || userCheck.rows[0].COUNT || 0);

    if (userCount === 0) {
      console.log('🌱 Seeding initial demo users...');
      const adminPass = await bcrypt.hash('admin123', 10);
      const staffPass = await bcrypt.hash('staff123', 10);

      await query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin User', 'admin@vms.com', adminPass, 'Admin']
      );
      await query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Staff Officer', 'staff@vms.com', staffPass, 'Staff']
      );
      console.log('✅ Seeded users: admin@vms.com (pass: admin123), staff@vms.com (pass: staff123)');
    }

    // Seed Sample Vehicles if empty
    const vehicleCheck = await query('SELECT COUNT(*) as count FROM vehicles');
    const vehicleCount = parseInt(vehicleCheck.rows[0].count || vehicleCheck.rows[0].COUNT || 0);

    if (vehicleCount === 0) {
      console.log('🌱 Seeding initial vehicle inventory...');
      const sampleVehicles = [
        ['TN38AB1234', 'Tata Ace Gold', 'Tata', 'Ace Gold', 'Truck', 'Diesel', 2022, '2022-07-12', 'Active'],
        ['KA01MH9876', 'Mahindra Bolero Pickup', 'Mahindra', 'Bolero Maxi', 'Pickup', 'Diesel', 2021, '2021-03-15', 'Active'],
        ['DL04CB4321', 'Toyota Innova Crysta', 'Toyota', 'Crysta 2.4', 'Van', 'Diesel', 2023, '2023-01-20', 'In Service'],
        ['MH12EV5555', 'Tata Nexon EV', 'Tata', 'EV Max', 'SUV', 'Electric', 2024, '2024-02-10', 'Active'],
        ['HR26CL8888', 'Ashok Leyland Dost', 'Ashok Leyland', 'Dost Plus', 'Truck', 'CNG', 2020, '2020-11-05', 'Maintenance']
      ];

      for (const v of sampleVehicles) {
        await query(
          `INSERT INTO vehicles 
          (vehicle_number, vehicle_name, brand, model, type, fuel, manufacturing_year, registration_date, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          v
        );
      }
      console.log('✅ Seeded 5 demo vehicles.');
    }

    console.log('✨ Database schema and setup completed cleanly.');
  } catch (error) {
    console.error('❌ Error during database setup:', error);
  }
};

module.exports = { setupDatabase };
