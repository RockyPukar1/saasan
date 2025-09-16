# Saasan Project Makefile
# Provides convenient commands for development and deployment

.PHONY: help setup dev build test clean docker-setup docker-dev docker-prod install-all

# Default target
help:
	@echo "🇳🇵 Saasan - Anti-corruption Platform for Nepal"
	@echo "=============================================="
	@echo ""
	@echo "Available commands:"
	@echo ""
	@echo "📦 Setup Commands:"
	@echo "  setup           - Complete project setup (install + env + database)"
	@echo "  install-all     - Install dependencies for all projects"
	@echo "  docker-setup    - Setup Docker development environment"
	@echo ""
	@echo "🚀 Development Commands:"
	@echo "  dev             - Start all development servers"
	@echo "  dev-backend     - Start backend server only"
	@echo "  dev-dashboard   - Start dashboard only"
	@echo "  dev-mobile      - Start mobile development server"
	@echo "  dev-mobile-web  - Start mobile web version"
	@echo ""
	@echo "🐳 Docker Commands:"
	@echo "  docker-dev      - Start development with Docker"
	@echo "  docker-prod     - Start production with Docker"
	@echo "  docker-down     - Stop all Docker containers"
	@echo ""
	@echo "🔨 Build Commands:"
	@echo "  build           - Build all projects"
	@echo "  build-backend   - Build backend only"
	@echo "  build-dashboard - Build dashboard only"
	@echo ""
	@echo "🧪 Test Commands:"
	@echo "  test            - Run all tests"
	@echo "  test-backend    - Run backend tests"
	@echo "  test-dashboard  - Run dashboard tests"
	@echo "  test-mobile     - Run mobile tests"
	@echo ""
	@echo "🗄️ Database Commands:"
	@echo "  db-setup        - Setup database and seed data"
	@echo "  db-seed         - Seed database with authentic Nepali data"
	@echo "  db-reset        - Reset database and reseed"
	@echo ""
	@echo "🧹 Cleanup Commands:"
	@echo "  clean           - Clean all dependencies and builds"
	@echo "  clean-deps      - Clean only dependencies"
	@echo "  clean-build     - Clean only build outputs"
	@echo ""
	@echo "📋 Utility Commands:"
	@echo "  lint            - Lint all projects"
	@echo "  format          - Format all code"
	@echo "  check           - Check code quality"
	@echo ""

# Setup commands
setup:
	@echo "🚀 Starting complete Saasan setup..."
	./scripts/setup.sh

install-all:
	@echo "📦 Installing dependencies for all projects..."
	npm run install:all

docker-setup:
	@echo "🐳 Setting up Docker development environment..."
	docker-compose -f docker-compose.dev.yml pull
	docker-compose -f docker-compose.dev.yml build

# Development commands
dev:
	@echo "🚀 Starting all development servers..."
	npm run dev

dev-backend:
	@echo "🔧 Starting backend server..."
	npm run dev:backend

dev-dashboard:
	@echo "📊 Starting dashboard..."
	npm run dev:dashboard

dev-mobile:
	@echo "📱 Starting mobile development server..."
	npm run dev:mobile

dev-mobile-web:
	@echo "🌐 Starting mobile web version..."
	npm run dev:mobile:web

# Docker commands
docker-dev:
	@echo "🐳 Starting development with Docker..."
	npm run docker:dev

docker-prod:
	@echo "🏭 Starting production with Docker..."
	npm run docker:prod

docker-down:
	@echo "🛑 Stopping all Docker containers..."
	npm run docker:down

# Build commands
build:
	@echo "🔨 Building all projects..."
	npm run build

build-backend:
	@echo "🔨 Building backend..."
	npm run build:backend

build-dashboard:
	@echo "🔨 Building dashboard..."
	npm run build:dashboard

# Test commands
test:
	@echo "🧪 Running all tests..."
	npm run test

test-backend:
	@echo "🧪 Running backend tests..."
	npm run test:backend

test-dashboard:
	@echo "🧪 Running dashboard tests..."
	npm run test:dashboard

test-mobile:
	@echo "🧪 Running mobile tests..."
	npm run test:mobile

# Database commands
db-setup:
	@echo "🗄️ Setting up database..."
	npm run setup:database

db-seed:
	@echo "🌱 Seeding database with authentic Nepali data..."
	npm run seed

db-reset:
	@echo "🔄 Resetting database..."
	npm run seed:reset

# Cleanup commands
clean:
	@echo "🧹 Cleaning all dependencies and builds..."
	npm run clean

clean-deps:
	@echo "🧹 Cleaning dependencies..."
	npm run clean:deps

clean-build:
	@echo "🧹 Cleaning build outputs..."
	npm run clean:build

# Utility commands
lint:
	@echo "📋 Linting all projects..."
	npm run lint

format:
	@echo "🎨 Formatting code..."
	@if command -v prettier >/dev/null 2>&1; then \
		find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | xargs prettier --write; \
	else \
		echo "Prettier not found. Install with: npm install -g prettier"; \
	fi

check:
	@echo "✅ Checking code quality..."
	@echo "Running TypeScript checks..."
	@cd saasan-node-be && npm run build
	@cd ../saasan-dashboard-react && npm run build
	@echo "✅ All checks passed!"

# Quick start for new developers
quick-start: install-all setup dev
	@echo "🎉 Quick start completed!"
	@echo "📱 Access points:"
	@echo "  Dashboard: http://localhost:3000"
	@echo "  Mobile Web: http://localhost:19006"
	@echo "  API: http://localhost:5000"
	@echo ""
	@echo "🔑 Login credentials:"
	@echo "  Admin: admin@saasan.np / admin123"
	@echo "  Citizen: citizen1@saasan.np / password123"
