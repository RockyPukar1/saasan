const { spawn } = require('child_process');
const { exec } = require('child_process');

console.log('🚀 Starting Saasan Development Environment...\n');

// Start backend server
console.log('🔧 Starting Backend Server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: './saasan-node-be',
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.log(`[Backend Error] ${data.toString().trim()}`);
});

// Start mobile app
console.log('📱 Starting React Native Mobile App...');
const mobile = spawn('npm', ['run', 'dev:web'], {
  cwd: './saasan-mobile-rn',
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, EXPO_NO_BROWSER: '1' }
});

mobile.stdout.on('data', (data) => {
  console.log(`[Mobile] ${data.toString().trim()}`);
});

mobile.stderr.on('data', (data) => {
  console.log(`[Mobile Error] ${data.toString().trim()}`);
});

// Start dashboard
console.log('💻 Starting React Dashboard...');
const dashboard = spawn('npm', ['run', 'dev'], {
  cwd: './saasan-dashboard-react',
  stdio: 'pipe',
  shell: true
});

dashboard.stdout.on('data', (data) => {
  console.log(`[Dashboard] ${data.toString().trim()}`);
});

dashboard.stderr.on('data', (data) => {
  console.log(`[Dashboard Error] ${data.toString().trim()}`);
});

// Open browsers after delay
setTimeout(() => {
  console.log('\n🌐 Opening browsers...');
  
  // Open Dashboard first
  exec('xdg-open http://localhost:5173', (error) => {
    if (error) console.log('Could not open Dashboard:', error.message);
    else console.log('✅ Dashboard opened at http://localhost:5173');
  });
  
  // Open React Native app after a short delay
  setTimeout(() => {
    exec('xdg-open http://localhost:8082', (error) => {
      if (error) console.log('Could not open React Native app:', error.message);
      else console.log('✅ React Native app opened at http://localhost:8082');
    });
  }, 2000);
  
  console.log('\n🎉 Development environment is ready!');
  console.log('📱 React Native: http://localhost:8082');
  console.log('💻 Dashboard: http://localhost:5173');
  console.log('🔧 Backend API: http://localhost:5000');
  console.log('\nPress Ctrl+C to stop all servers\n');
}, 15000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping all servers...');
  backend.kill();
  mobile.kill();
  dashboard.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping all servers...');
  backend.kill();
  mobile.kill();
  dashboard.kill();
  process.exit(0);
});
