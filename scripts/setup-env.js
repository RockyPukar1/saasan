#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment files...\n');

// Backend environment template
const backendEnvTemplate = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saasan
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_TOKEN=jwt_refresh_token
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,application/pdf

# External APIs (Optional)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
SMS_API_KEY=your-sms-api-key

# Viral Features Configuration
VIRAL_SHARE_BASE_URL=http://localhost:5000
VIRAL_TRACKING_ENABLED=true
`;

// Dashboard environment template
const dashboardEnvTemplate = `# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Saasan Dashboard
VITE_APP_VERSION=1.0.0

# Authentication
VITE_JWT_STORAGE_KEY=saasan_dashboard_token

# Feature Flags
VITE_ENABLE_VIRAL_FEATURES=true
VITE_ENABLE_POLLING=true
VITE_ENABLE_ANALYTICS=true

# Development
VITE_DEV_MODE=true
`;

// Mobile environment template
const mobileEnvTemplate = `# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
EXPO_PUBLIC_APP_NAME=Saasan
EXPO_PUBLIC_APP_VERSION=1.0.0

# Authentication
EXPO_PUBLIC_JWT_STORAGE_KEY=saasan_mobile_token

# Feature Flags
EXPO_PUBLIC_ENABLE_VIRAL_FEATURES=true
EXPO_PUBLIC_ENABLE_LOCATION=true
EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true

# Development
EXPO_PUBLIC_DEV_MODE=true
EXPO_PUBLIC_MOCK_DATA=false
`;

// Docker environment template
const dockerEnvTemplate = `# Database Configuration
POSTGRES_DB=saasan_db
POSTGRES_USER=saasan_user
POSTGRES_PASSWORD=saasan_password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Backend Configuration
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:5000/api
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Redis Configuration (Optional)
REDIS_URL=redis://redis:6379

# File Storage
UPLOAD_PATH=/app/uploads
`;

// Create environment files
const envFiles = [
  { path: 'saasan-node-be/.env', content: backendEnvTemplate },
  { path: 'saasan-dashboard-react/.env', content: dashboardEnvTemplate },
  { path: 'saasan-mobile-rn/.env', content: mobileEnvTemplate },
  { path: '.env.docker', content: dockerEnvTemplate }
];

envFiles.forEach(({ path: envPath, content }) => {
  const fullPath = path.join(process.cwd(), envPath);
  
  // Create directory if it doesn't exist
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write file if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Created ${envPath}`);
  } else {
    console.log(`⚠️  ${envPath} already exists, skipping...`);
  }
});

console.log('\n🎉 Environment setup complete!');
console.log('\n📝 Next steps:');
console.log('1. Review and update the generated .env files with your actual values');
console.log('2. Make sure PostgreSQL is running on your system');
console.log('3. Run "npm run setup:database" to create the database and tables');
console.log('4. Run "npm run seed" to populate with sample data');
console.log('5. Run "npm run dev" to start all services');
