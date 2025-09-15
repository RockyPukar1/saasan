# Saasan - Political Transparency Platform

A comprehensive political transparency platform that enables citizens to track politicians, report corruption, and participate in democratic processes through polls and surveys.

## 🏗️ Project Architecture

This is a full-stack application consisting of three main components:

- **Backend API** (`saasan-node-be/`) - Node.js/Express REST API with PostgreSQL database
- **React Dashboard** (`saasan-dashboard-react/`) - Admin dashboard for managing the platform
- **React Native Mobile App** (`saasan-mobile-rn/`) - Mobile application for citizens

## 📁 Project Structure

```
saasan/
├── saasan-node-be/                 # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── controllers/           # API route handlers
│   │   ├── models/                # Database models
│   │   ├── routes/                # API routes
│   │   ├── middleware/            # Authentication & validation
│   │   ├── lib/helpers/           # Utility functions
│   │   └── types/                 # TypeScript type definitions
│   ├── scripts/                   # Database seeding scripts
│   └── package.json
├── saasan-dashboard-react/         # React Admin Dashboard
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API service functions
│   │   ├── contexts/              # React contexts
│   │   └── types/                 # TypeScript type definitions
│   └── package.json
├── saasan-mobile-rn/              # React Native Mobile App
│   ├── app/                       # Expo Router pages
│   ├── components/                # Reusable components
│   ├── hooks/                     # Custom hooks
│   ├── services/                  # API services
│   └── package.json
├── scripts/                       # Development scripts
└── package.json                   # Root package.json for managing all services
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **pgAdmin4** (for database management)
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd saasan
```

### 2. Install Dependencies

```bash
# Install all dependencies for all projects
npm run install:all
```

### 3. Database Setup

#### Install PostgreSQL

- **Ubuntu/Debian:**

  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  ```

- **macOS:**

  ```bash
  brew install postgresql
  ```

- **Windows:** Download from [postgresql.org](https://www.postgresql.org/download/windows/)

#### Create Database

```bash
# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE saasan_db;
CREATE USER saasan_user WITH PASSWORD 'saasan_password';
GRANT ALL PRIVILEGES ON DATABASE saasan_db TO saasan_user;
\q
```

#### Install pgAdmin4

- **Ubuntu/Debian:**

  ```bash
  wget --quiet -O - https://www.pgadmin.org/static/pgp_pgadmin_asc.key | sudo apt-key add -
  sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list'
  sudo apt update
  sudo apt install pgadmin4
  ```

- **macOS:**

  ```bash
  brew install --cask pgadmin4
  ```

- **Windows:** Download from [pgadmin.org](https://www.pgadmin.org/download/)

#### Configure pgAdmin4

1. Open pgAdmin4
2. Right-click "Servers" → "Create" → "Server"
3. **General Tab:**
   - Name: `Saasan Local`
4. **Connection Tab:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `saasan_db`
   - Username: `saasan_user`
   - Password: `saasan_password`
5. Click "Save"

### 4. Environment Configuration

Create environment files for each service:

#### Backend Environment (`saasan-node-be/.env`)

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saasan_db
DB_USER=saasan_user
DB_PASSWORD=saasan_password
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### React Dashboard Environment (`saasan-dashboard-react/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 5. Database Setup

```bash
# Navigate to backend directory
cd saasan-node-be

# Create poll tables (if not already created)
npm run create:poll-tables

# Run database seeding with sample data
npm run seed:smart
```

### 6. Start Development Servers

#### Option 1: Start All Services (Recommended)

```bash
# From root directory
npm run dev
```

This will start:

- Backend API on `http://localhost:5000`
- React Dashboard on `http://localhost:5173`
- React Native Web on `http://localhost:8082`

#### Option 2: Start Services Individually

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - React Dashboard
npm run dev:dashboard

# Terminal 3 - React Native Mobile
npm run dev:mobile
```

### 7. Access the Applications

- **React Dashboard:** http://localhost:5173
- **React Native Web:** http://localhost:8082
- **Backend API:** http://localhost:5000/api/v1
- **API Documentation:** http://localhost:5000/api/v1/docs

## 🛠️ Development Guide

### Creating a New Page

#### React Dashboard

1. Create page component in `saasan-dashboard-react/src/pages/`
2. Add route in `saasan-dashboard-react/src/App.tsx`
3. Add navigation item in `saasan-dashboard-react/src/components/layout/DashboardLayout.tsx`

#### React Native Mobile

1. Create page in `saasan-mobile-rn/app/` directory
2. Add route in `saasan-mobile-rn/app/_layout.tsx` if needed

### Creating a New API Endpoint

1. Add route in `saasan-node-be/src/routes/`
2. Create controller method in `saasan-node-be/src/controllers/`
3. Add model methods in `saasan-node-be/src/models/`
4. Update API service in frontend projects

### Database Changes

1. Create migration script in `saasan-node-be/scripts/`
2. Update model definitions in `saasan-node-be/src/models/`
3. Update TypeScript types in `saasan-node-be/src/types/`
4. Update frontend types accordingly

## 🔄 Git Workflow

### Creating a New Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code changes ...

# Stage and commit changes
git add .
git commit -m "feat: add your feature description"

# Push branch to remote
git push origin feature/your-feature-name
```

### Creating a Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request" for your branch
3. Fill in PR description:
   - **Title:** Brief description of changes
   - **Description:** Detailed explanation of what was changed and why
   - **Screenshots:** If UI changes were made
4. Assign reviewers
5. Add appropriate labels
6. Submit PR

### PR Review Process

1. **Code Review:** Team members review code for:

   - Code quality and best practices
   - Security considerations
   - Performance implications
   - Test coverage

2. **Testing:** Ensure all tests pass and manual testing is done

3. **Approval:** At least one team member must approve

4. **Merge:** Once approved, merge to main branch

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd saasan-node-be
npm test

# Frontend tests
cd saasan-dashboard-react
npm test

# Mobile tests
cd saasan-mobile-rn
npm test
```

### Test Coverage

```bash
# Backend coverage
cd saasan-node-be
npm run test:coverage

# Frontend coverage
cd saasan-dashboard-react
npm run test:coverage
```

## 📦 Building for Production

### Backend

```bash
cd saasan-node-be
npm run build
npm start
```

### React Dashboard

```bash
cd saasan-dashboard-react
npm run build
# Deploy dist/ folder to your hosting service
```

### React Native Mobile

```bash
cd saasan-mobile-rn
# For Android
npm run android

# For iOS
npm run ios

# For web
npm run build
```

## 🚀 Deployment

### Backend Deployment

1. Set up PostgreSQL database on your server
2. Configure environment variables
3. Build and start the application
4. Set up reverse proxy (nginx) if needed

### Frontend Deployment

1. Build the React dashboard
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables

### Mobile App Deployment

1. Build for production
2. Upload to app stores (Google Play, Apple App Store)

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :5000  # or :5173, :8082

# Kill process
kill -9 <PID>
```

#### Database Connection Issues

1. Check PostgreSQL is running
2. Verify database credentials
3. Check firewall settings

#### Node Modules Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

1. Check existing issues in GitHub
2. Create new issue with:
   - Description of problem
   - Steps to reproduce
   - Expected vs actual behavior
   - System information

## 📚 API Documentation

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/profile` - Get user profile

### Politicians

- `GET /api/v1/politicians` - List politicians
- `GET /api/v1/politicians/:id` - Get politician details
- `POST /api/v1/politicians` - Create politician
- `PUT /api/v1/politicians/:id` - Update politician
- `DELETE /api/v1/politicians/:id` - Delete politician

### Polls

- `GET /api/v1/polls` - List polls
- `GET /api/v1/polls/:id` - Get poll details
- `POST /api/v1/polls` - Create poll
- `POST /api/v1/polls/:id/vote/:optionId` - Vote on poll
- `GET /api/v1/polls/analytics` - Get poll analytics

### Reports

- `GET /api/v1/reports` - List corruption reports
- `POST /api/v1/reports` - Create report
- `PUT /api/v1/reports/:id/status` - Update report status

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Backend Development:** Node.js/Express API
- **Frontend Development:** React Dashboard & React Native Mobile
- **Database Design:** PostgreSQL with Knex.js
- **UI/UX Design:** Tailwind CSS with custom components

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**Happy Coding! 🚀**
