# Saasan - Political Transparency Platform

A comprehensive political transparency platform that enables citizens to track politicians, report corruption, and participate in democratic processes through polls and surveys. Built for Nepal with full bilingual support (English/Nepali) and ready for the 2027 elections.

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
│   │   ├── services/              # Business logic
│   │   ├── routes/                # API routes
│   │   ├── middleware/            # Authentication & validation
│   │   ├── lib/                   # Utility functions
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
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd saasan
```

### 2. Complete Setup (One Command)

```bash
# This single command does everything:
npm run setup
```

**What `npm run setup` does:**

- Installs all dependencies for all projects
- Sets up environment files with default values
- Creates all database tables with proper relationships
- Seeds comprehensive Nepali data including:
  - All 7 provinces with bilingual names
  - Districts and constituencies
  - Political parties and politicians
  - Election candidates with manifestos
  - Polls and voting sessions
  - Corruption reports and badges
  - Campaign data and voter registrations

### 3. Start Development

```bash
# Start all services (backend, dashboard, mobile)
npm run dev
```

**Services will be available at:**

- **Backend API**: http://localhost:5000
- **Dashboard**: http://localhost:3000
- **Mobile Web**: http://localhost:8081

## 📊 Available Data

After setup, you'll have:

### 🗺️ Geographic Data

- 7 Provinces (all of Nepal)
- 11 Districts (major districts)
- 9 Constituencies (key constituencies)
- All with bilingual names (English + Nepali)

### 🏛️ Political System

- 5 Major Political Parties
- 5 Politicians with detailed profiles
- 2 Election Candidates with full manifestos
- Party ideologies and symbols

### 🗳️ Election Infrastructure

- Voting Sessions for 2027 elections
- Voter Registrations with verification
- Voter Intent Surveys
- Candidate comparisons and voting

### 📊 Content & Engagement

- 2 Trending Polls with options
- 2 Corruption Reports with verification
- 6 Achievement Badges with progress
- Campaign analytics and tracking

## 🌐 Bilingual System

The platform features a unified bilingual system where English and Nepali are treated together:

- **Display Format**: "काठमाडौं (Kathmandu)" or "Kathmandu (काठमाडौं)"
- **Smart Fallback**: Shows available language when only one exists
- **Cultural Context**: Authentic Nepali content with English translations
- **Complete Coverage**: Every piece of data has both languages

## 🛠️ Development Commands

### Essential Commands (from project root):

```bash
# Install all dependencies
npm run install:all

# Complete setup (install + env + database + seed)
npm run setup

# Start all services
npm run dev

# Setup environment files only
npm run setup:env

# Setup database and seed data only
npm run seed:smart
```

### Individual Service Commands:

```bash
# Backend only
npm run dev:backend

# Dashboard only
npm run dev:dashboard

# Mobile only
npm run dev:mobile
```

## 🗄️ Database Schema

The platform includes a comprehensive database schema with:

- **Users & Authentication**: User management with JWT
- **Geographic Hierarchy**: Provinces → Districts → Constituencies → Wards
- **Political System**: Parties → Politicians → Candidates
- **Content System**: Reports, Polls, Comments, Badges
- **Election Infrastructure**: Voting Sessions, Voter Registration, Surveys
- **Campaign System**: Analytics, Comparisons, Voting

All tables include bilingual fields for complete English/Nepali support.

## 🔧 Environment Configuration

Environment files are created automatically with default values:

### Backend (`saasan-node-be/.env`)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saasan_db
DB_USER=saasan_user
DB_PASSWORD=saasan_password
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### Dashboard (`saasan-dashboard-react/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Mobile (`saasan-mobile-rn/.env`)

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 🎯 Features

### For Citizens (Mobile App)

- **Politician Tracking**: View politician profiles and track their activities
- **Corruption Reporting**: Report corruption cases with evidence
- **Polls & Surveys**: Participate in community polls and surveys
- **Election Features**:
  - Candidate comparison
  - Voter registration
  - In-app voting
  - Campaign tracking
- **Achievement System**: Earn badges for civic engagement
- **Bilingual Support**: Switch between English and Nepali

### For Administrators (Dashboard)

- **Content Management**: Manage politicians, parties, reports
- **User Management**: Handle user accounts and verification
- **Analytics**: View platform usage and engagement metrics
- **Election Management**: Set up voting sessions and manage candidates
- **Bilingual Content**: Create and edit content in both languages

### For Developers (API)

- **RESTful API**: Complete API for all platform features
- **Authentication**: JWT-based authentication system
- **File Upload**: Support for images and documents
- **Bilingual Responses**: API responses include both languages
- **Election APIs**: Complete election management endpoints

## 🗳️ 2027 Election Ready

The platform is specifically designed for Nepal's 2027 elections:

- **Campaign Tracking**: "This Holiday for My Country" campaign system
- **Voter Intent Surveys**: Track who's returning, unsure, or cannot vote
- **Candidate Comparison**: Side-by-side candidate comparison tools
- **In-App Voting**: Secure voting system for both federal and provincial elections
- **Real-Time Results**: Live election results and analytics
- **Constituency Management**: Complete constituency and ward system

## 🤝 Contributing

### Setting Up for Development

1. **Fork the repository**
2. **Clone your fork**
3. **Run setup**: `npm run setup`
4. **Start development**: `npm run dev`

### Development Guidelines

#### Code Style

- Use TypeScript for type safety
- Follow existing code patterns
- Use meaningful variable and function names
- Add comments for complex logic

#### Bilingual Implementation

- Always include both English and Nepali fields
- Use the `getLocalizedText()` utility function
- Ensure cultural context is preserved
- Test with both languages

#### Database Changes

- Create migration files for schema changes
- Update seed data to include new fields
- Ensure foreign key relationships are maintained
- Test with both languages

#### API Development

- Follow RESTful conventions
- Include proper error handling
- Return bilingual responses
- Add proper TypeScript types

#### Frontend Development

- Use the bilingual utility functions
- Implement proper loading states
- Handle error scenarios gracefully
- Ensure responsive design

### Pull Request Process

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes** following the guidelines above
3. **Test thoroughly** with both English and Nepali
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

### Issue Reporting

When reporting issues, please include:

- **Environment details** (OS, Node version, etc.)
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Console logs** for errors

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the people of Nepal
- Designed for the 2027 elections
- Supports both English and Nepali languages
- Open source for transparency and democracy

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review existing issues for solutions

---

**Made with ❤️ for Nepal's democracy and transparency** 🇳🇵
