const bcrypt = require('bcryptjs');
const knex = require('knex');

// Database configuration
const config = {
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DBPORT || "5432"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "saasan",
  },
};

const db = knex(config);

async function createAdminUser() {
  try {
    console.log('🌱 Starting admin user creation...');
    
    // Check if admin user already exists
    const existingAdmin = await db('users').where({ email: 'admin@saasan.com' }).first();
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@saasan.com');
      console.log('🔑 Password: admin123');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Generate UUID (simple version for this script)
    const adminId = 'admin-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Create admin user
    const adminUser = await db('users').insert({
      id: adminId,
      email: 'admin@saasan.com',
      password_hash: hashedPassword,
      full_name: 'System Administrator',
      phone: '+977-1-1234567',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan City',
      ward_number: 1,
      role: 'admin', // Admin role
      created_at: new Date(),
      updated_at: new Date(),
      last_active_at: new Date(),
    }).returning('*');

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@saasan.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('🆔 User ID:', adminUser[0].id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await db.destroy();
  }
}

// Run the script
createAdminUser();
