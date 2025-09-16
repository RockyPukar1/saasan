#!/bin/bash

# Saasan Project Setup Script
# This script automates the complete setup process for the Saasan project

set -e  # Exit on any error

echo "🇳🇵 Welcome to Saasan - Anti-corruption Platform Setup"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    print_success "Node.js $(node --version) ✓"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm --version) ✓"
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL is not installed. Please install PostgreSQL 12+ from https://www.postgresql.org/download/"
        print_warning "You can also use Docker: docker run --name postgres -e POSTGRES_PASSWORD=saasan_password -p 5432:5432 -d postgres:15"
    else
        print_success "PostgreSQL ✓"
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        print_success "Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) ✓"
    else
        print_warning "Docker is not installed (optional for containerized development)"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies for all projects..."
    
    # Root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd saasan-node-be
    npm install
    cd ..
    
    # Dashboard dependencies
    print_status "Installing dashboard dependencies..."
    cd saasan-dashboard-react
    npm install
    cd ..
    
    # Mobile dependencies
    print_status "Installing mobile dependencies..."
    cd saasan-mobile-rn
    npm install
    cd ..
    
    print_success "All dependencies installed successfully!"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    if [ -f "scripts/setup-env.js" ]; then
        node scripts/setup-env.js
        print_success "Environment files created!"
    else
        print_error "Environment setup script not found!"
        exit 1
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if PostgreSQL is running
    if command -v psql &> /dev/null; then
        # Try to connect to PostgreSQL
        if ! psql -h localhost -U postgres -c "SELECT 1;" &> /dev/null; then
            print_warning "Cannot connect to PostgreSQL. Please ensure PostgreSQL is running."
            print_warning "You can start PostgreSQL with: sudo systemctl start postgresql"
            print_warning "Or use Docker: docker run --name postgres -e POSTGRES_PASSWORD=saasan_password -p 5432:5432 -d postgres:15"
            read -p "Continue anyway? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
    fi
    
    # Setup database tables and seed data
    cd saasan-node-be
    npm run setup:db
    cd ..
    
    print_success "Database setup completed!"
}

# Create a comprehensive README
create_readme() {
    print_status "Creating comprehensive README..."
    
    cat > README.md << 'EOF'
# 🇳🇵 Saasan - Anti-corruption Platform for Nepal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.70+-purple.svg)](https://reactnative.dev/)

Saasan is a comprehensive anti-corruption platform designed specifically for Nepal, featuring viral social engagement, real-time corruption tracking, and citizen participation tools.

## 🚀 Features

### Core Functionality
- **Corruption Reporting**: Citizens can report corruption cases with evidence
- **Politician Tracking**: Rate and monitor politicians' performance
- **Real-time Polling**: Participate in trending polls on governance issues
- **Geographic Mapping**: Location-based corruption case visualization
- **Historical Events**: Track corruption cases over time

### Viral Features
- **Instant Shareability**: Share reports, polls, and politician profiles
- **Gamified Participation**: Badges, leaderboards, and streaks
- **Community Engagement**: Comments, upvotes, and discussions
- **Trust & Credibility**: Verification system and transparency feeds
- **Election Mode**: Special features during election periods

### Technical Features
- **Multi-platform**: React Native mobile app, React dashboard, Node.js backend
- **Real-time Updates**: Live polling and instant notifications
- **Multilingual**: English and Nepali language support
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Secure Authentication**: JWT-based authentication system

## 🏗️ Architecture

```
saasan/
├── saasan-mobile-rn/     # React Native mobile app
├── saasan-dashboard-react/ # React admin dashboard
├── saasan-node-be/       # Node.js backend API
├── docker-compose.yml    # Docker development setup
└── scripts/             # Setup and utility scripts
```

## 🛠️ Tech Stack

### Frontend
- **Mobile**: React Native with Expo, NativeWind (Tailwind CSS)
- **Dashboard**: React with Vite, TypeScript, Tailwind CSS
- **State Management**: React Query, Context API
- **UI Components**: Custom components with Tailwind CSS

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js ORM
- **Authentication**: JWT with bcrypt
- **File Storage**: Cloudinary integration

### DevOps
- **Containerization**: Docker and Docker Compose
- **Development**: Hot reload, concurrent development servers
- **Database**: PostgreSQL with automated migrations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL 12+ (or Docker)
- Git

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/saasan.git
cd saasan

# Run the automated setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Start all services
npm run dev
```

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm run install:all

# 2. Setup environment files
npm run setup:env

# 3. Setup database
npm run setup:database

# 4. Seed with authentic Nepali data
npm run seed

# 5. Start development servers
npm run dev
```

## 🐳 Docker Development

```bash
# Start all services with Docker
npm run docker:dev

# Or manually with docker-compose
docker-compose -f docker-compose.dev.yml up --build
```

## 📱 Development URLs

After starting the development servers:

- **Mobile App (Web)**: http://localhost:19006
- **Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs

## 🔑 Default Login Credentials

### Admin Access
- **Email**: admin@saasan.np
- **Password**: admin123

### Citizen Access
- **Email**: citizen1@saasan.np
- **Password**: password123

### Journalist Access
- **Email**: reporter@saasan.np
- **Password**: password123

## 📊 Sample Data

The platform comes pre-loaded with authentic Nepali data:

- **7 Provinces** with all districts
- **35 Districts** across Nepal
- **7 Major Political Parties**
- **7 Politicians** (federal, provincial, and local level)
- **5 Current Corruption Cases** with real scenarios
- **3 Trending Polls** on current issues

## 🎯 Available Scripts

### Root Level Commands
```bash
npm run dev              # Start all services concurrently
npm run install:all      # Install dependencies for all projects
npm run setup            # Complete setup (install + env + database)
npm run build            # Build all projects
npm run test             # Run all tests
npm run lint             # Lint all projects
npm run clean            # Clean all dependencies and builds
```

### Individual Service Commands
```bash
# Backend
npm run dev:backend      # Start backend only
npm run build:backend    # Build backend only

# Dashboard
npm run dev:dashboard    # Start dashboard only
npm run build:dashboard  # Build dashboard only

# Mobile
npm run dev:mobile       # Start mobile development server
npm run dev:mobile:web   # Start mobile web version
npm run dev:mobile:ios   # Start iOS simulator
npm run dev:mobile:android # Start Android emulator
```

### Database Commands
```bash
npm run setup:database   # Create tables and seed data
npm run seed             # Seed with authentic Nepali data
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Corruption Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report

### Politicians
- `GET /api/politicians` - Get all politicians
- `GET /api/politicians/:id` - Get specific politician
- `POST /api/politicians/:id/rate` - Rate politician

### Polls
- `GET /api/polls` - Get all polls
- `POST /api/polls` - Create new poll
- `POST /api/polls/:id/vote` - Vote on poll

### Viral Features
- `POST /api/viral/share` - Track sharing
- `GET /api/viral/leaderboard` - Get leaderboard
- `GET /api/viral/badges` - Get user badges

## 🏛️ Database Schema

### Core Tables
- `users` - User accounts and authentication
- `provinces` - Nepal's provinces
- `districts` - Nepal's districts
- `political_parties` - Political parties
- `politicians` - Politician profiles
- `corruption_reports` - Corruption case reports
- `polls` - Polling questions and results

### Viral Tables
- `badges` - Achievement badges
- `user_badges` - User badge assignments
- `viral_shares` - Social sharing tracking
- `leaderboard` - User rankings
- `comments` - User comments and discussions

## 🤝 Contributing

We welcome contributions to make Saasan better! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nepal's Anti-corruption Commission** for inspiration
- **Citizen journalists** and **civil society organizations**
- **Open source community** for the amazing tools
- **Nepali developers** contributing to transparency

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/saasan/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/saasan/discussions)
- **Email**: support@saasan.np

## 🔮 Roadmap

- [ ] **Mobile App Stores**: iOS and Android app store releases
- [ ] **AI Integration**: Automated corruption detection
- [ ] **Blockchain**: Immutable corruption records
- [ ] **Multi-language**: Additional local languages
- [ ] **Advanced Analytics**: Corruption pattern analysis
- [ ] **Government Integration**: Official API connections

---

**Made with ❤️ for Nepal's fight against corruption**

*Saasan - Where citizens become the change they want to see*
EOF

    print_success "README.md created successfully!"
}

# Main setup function
main() {
    echo "Starting Saasan setup process..."
    echo ""
    
    # Step 1: Check requirements
    check_requirements
    echo ""
    
    # Step 2: Install dependencies
    install_dependencies
    echo ""
    
    # Step 3: Setup environment
    setup_environment
    echo ""
    
    # Step 4: Setup database
    setup_database
    echo ""
    
    # Step 5: Create README
    create_readme
    echo ""
    
    print_success "🎉 Saasan setup completed successfully!"
    echo ""
    echo "📱 Next steps:"
    echo "1. Run 'npm run dev' to start all services"
    echo "2. Open http://localhost:3000 for the dashboard"
    echo "3. Open http://localhost:19006 for the mobile web app"
    echo "4. API is available at http://localhost:5000"
    echo ""
    echo "🔑 Login credentials:"
    echo "Admin: admin@saasan.np / admin123"
    echo "Citizen: citizen1@saasan.np / password123"
    echo ""
    echo "🐳 For Docker development:"
    echo "Run 'npm run docker:dev' to start with Docker"
    echo ""
    echo "📚 Check README.md for detailed documentation"
}

# Run main function
main "$@"
