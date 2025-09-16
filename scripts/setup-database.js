const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, args, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    log(`\n${colors.blue}Running: ${command} ${args.join(' ')}${colors.reset}`);
    
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`${colors.green}✅ Command completed successfully${colors.reset}`);
        resolve();
      } else {
        log(`${colors.red}❌ Command failed with exit code ${code}${colors.reset}`);
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      log(`${colors.red}❌ Command failed: ${error.message}${colors.reset}`);
      reject(error);
    });
  });
}

async function createAllTables() {
  try {
    log(`${colors.bright}${colors.cyan}🗄️ Creating all database tables...${colors.reset}`);
    
    const backendPath = path.join(__dirname, '../saasan-node-be');
    
    // Create all necessary tables
    const createTablesSQL = `
-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS user_votes CASCADE;
DROP TABLE IF EXISTS voting_sessions CASCADE;
DROP TABLE IF EXISTS voting_centers CASCADE;
DROP TABLE IF EXISTS voter_intent_surveys CASCADE;
DROP TABLE IF EXISTS voter_registrations CASCADE;
DROP TABLE IF EXISTS election_candidates CASCADE;
DROP TABLE IF EXISTS candidate_comparisons CASCADE;
DROP TABLE IF EXISTS campaign_analytics CASCADE;
DROP TABLE IF EXISTS election_campaigns CASCADE;
DROP TABLE IF EXISTS viral_shares CASCADE;
DROP TABLE IF EXISTS viral_reactions CASCADE;
DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS comment_reports CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS poll_votes CASCADE;
DROP TABLE IF EXISTS poll_options CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS report_reactions CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS politicians CASCADE;
DROP TABLE IF EXISTS political_parties CASCADE;
DROP TABLE IF EXISTS constituencies CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS provinces CASCADE;
DROP TABLE IF EXISTS wards CASCADE;
DROP TABLE IF EXISTS municipalities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    constituency_id INTEGER,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_active TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Provinces table
CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_nepali VARCHAR(100),
    capital VARCHAR(100),
    capital_nepali VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Districts table
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_nepali VARCHAR(100),
    province_id INTEGER REFERENCES provinces(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Constituencies table
CREATE TABLE constituencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_nepali VARCHAR(100),
    district_id INTEGER REFERENCES districts(id),
    province_id INTEGER REFERENCES provinces(id),
    total_voters INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Municipalities table
CREATE TABLE municipalities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_nepali VARCHAR(100),
    district_id INTEGER REFERENCES districts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Wards table
CREATE TABLE wards (
    id SERIAL PRIMARY KEY,
    ward_number INTEGER NOT NULL,
    municipality_id INTEGER REFERENCES municipalities(id),
    constituency_id INTEGER REFERENCES constituencies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Political Parties table
CREATE TABLE political_parties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_nepali VARCHAR(255),
    abbreviation VARCHAR(20),
    abbreviation_nepali VARCHAR(20),
    ideology VARCHAR(100),
    ideology_nepali VARCHAR(100),
    founded_year INTEGER,
    logo_url VARCHAR(500),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Politicians table
CREATE TABLE politicians (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    full_name_nepali VARCHAR(100),
    age INTEGER,
    education VARCHAR(500),
    education_nepali VARCHAR(500),
    profession VARCHAR(100),
    profession_nepali VARCHAR(100),
    constituency_id INTEGER REFERENCES constituencies(id),
    party_id INTEGER REFERENCES political_parties(id),
    position VARCHAR(100),
    position_nepali VARCHAR(100),
    experience_years INTEGER,
    photo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(3,2),
    total_reports INTEGER DEFAULT 0,
    verified_reports INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Reports table
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_nepali VARCHAR(255),
    description TEXT,
    description_nepali TEXT,
    category VARCHAR(50),
    category_nepali VARCHAR(50),
    constituency_id INTEGER REFERENCES constituencies(id),
    reported_by INTEGER REFERENCES users(id),
    amount_involved DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    upvotes_count INTEGER DEFAULT 0,
    downvotes_count INTEGER DEFAULT 0,
    reference_number VARCHAR(50),
    tags TEXT[],
    tags_nepali TEXT[],
    verification_notes TEXT,
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Polls table
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_nepali VARCHAR(255),
    description TEXT,
    description_nepali TEXT,
    category VARCHAR(50),
    category_nepali VARCHAR(50),
    constituency_id INTEGER REFERENCES constituencies(id),
    created_by INTEGER REFERENCES users(id),
    total_votes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Poll Options table
CREATE TABLE poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    option_text_nepali VARCHAR(255),
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Poll Votes table
CREATE TABLE poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id),
    option_id INTEGER REFERENCES poll_options(id),
    user_id INTEGER REFERENCES users(id),
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, user_id)
);

-- Create Badges table
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_nepali VARCHAR(100),
    description TEXT,
    description_nepali TEXT,
    category VARCHAR(50),
    rarity VARCHAR(20),
    max_progress INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User Badges table
CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    badge_id INTEGER REFERENCES badges(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    UNIQUE(user_id, badge_id)
);

-- Create User Activities table
CREATE TABLE user_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_type VARCHAR(100),
    points_earned INTEGER DEFAULT 0,
    activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    parent_comment_id INTEGER REFERENCES comments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Comment Likes table
CREATE TABLE comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    like_type VARCHAR(10) CHECK (like_type IN ('up', 'down')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id)
);

-- Create Comment Reports table
CREATE TABLE comment_reports (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER REFERENCES comments(id),
    user_id INTEGER REFERENCES users(id),
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Viral Shares table
CREATE TABLE viral_shares (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    platform VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Viral Reactions table
CREATE TABLE viral_reactions (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    reaction_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Report Reactions table
CREATE TABLE report_reactions (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id),
    user_id INTEGER REFERENCES users(id),
    reaction_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Election Campaigns table
CREATE TABLE election_campaigns (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_nepali VARCHAR(255),
    description TEXT,
    description_nepali TEXT,
    campaign_type VARCHAR(50) NOT NULL,
    target_constituency_id INTEGER REFERENCES constituencies(id),
    target_province_id INTEGER REFERENCES provinces(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    metrics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Campaign Analytics table
CREATE TABLE campaign_analytics (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES election_campaigns(id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC,
    metric_date DATE NOT NULL,
    constituency_id INTEGER REFERENCES constituencies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Election Candidates table
CREATE TABLE election_candidates (
    id SERIAL PRIMARY KEY,
    politician_id INTEGER REFERENCES politicians(id),
    election_type VARCHAR(50) NOT NULL,
    election_year INTEGER NOT NULL,
    constituency_id INTEGER REFERENCES constituencies(id),
    party_id INTEGER REFERENCES political_parties(id),
    candidate_number INTEGER,
    symbol VARCHAR(100),
    symbol_nepali VARCHAR(100),
    manifesto TEXT,
    manifesto_nepali TEXT,
    key_promises TEXT[],
    key_promises_nepali TEXT[],
    education_background TEXT,
    education_background_nepali TEXT,
    professional_experience TEXT,
    professional_experience_nepali TEXT,
    criminal_records JSONB,
    asset_declaration JSONB,
    nomination_date DATE,
    withdrawal_date DATE,
    is_active BOOLEAN DEFAULT true,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Candidate Comparisons table
CREATE TABLE candidate_comparisons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    candidate_1_id INTEGER REFERENCES election_candidates(id),
    candidate_2_id INTEGER REFERENCES election_candidates(id),
    comparison_criteria JSONB,
    user_preference INTEGER,
    comparison_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Voter Registrations table
CREATE TABLE voter_registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    constituency_id INTEGER REFERENCES constituencies(id),
    ward_id INTEGER REFERENCES wards(id),
    registration_number VARCHAR(50) UNIQUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_status VARCHAR(20) DEFAULT 'pending',
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Voter Intent Surveys table
CREATE TABLE voter_intent_surveys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    constituency_id INTEGER REFERENCES constituencies(id),
    return_intent VARCHAR(20) NOT NULL,
    return_reason TEXT,
    return_reason_nepali TEXT,
    voting_intent VARCHAR(20),
    preferred_candidate_id INTEGER REFERENCES election_candidates(id),
    concerns TEXT[],
    concerns_nepali TEXT[],
    suggestions TEXT,
    suggestions_nepali TEXT,
    survey_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Voting Sessions table
CREATE TABLE voting_sessions (
    id SERIAL PRIMARY KEY,
    election_type VARCHAR(50) NOT NULL,
    election_year INTEGER NOT NULL,
    constituency_id INTEGER REFERENCES constituencies(id),
    session_name VARCHAR(255) NOT NULL,
    session_name_nepali VARCHAR(255),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    total_eligible_voters INTEGER,
    total_votes_cast INTEGER DEFAULT 0,
    results_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Voting Centers table
CREATE TABLE voting_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_nepali VARCHAR(255),
    address TEXT NOT NULL,
    address_nepali TEXT,
    constituency_id INTEGER REFERENCES constituencies(id),
    ward_id INTEGER REFERENCES wards(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity INTEGER,
    facilities TEXT[],
    contact_person VARCHAR(255),
    contact_number VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User Votes table
CREATE TABLE user_votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    voting_session_id INTEGER REFERENCES voting_sessions(id),
    candidate_id INTEGER REFERENCES election_candidates(id),
    vote_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    device_fingerprint VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    verification_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_reports_constituency_id ON reports(constituency_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_polls_constituency_id ON polls(constituency_id);
CREATE INDEX idx_polls_is_active ON polls(is_active);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_politicians_constituency_id ON politicians(constituency_id);
CREATE INDEX idx_politicians_party_id ON politicians(party_id);
CREATE INDEX idx_election_candidates_constituency_id ON election_candidates(constituency_id);
CREATE INDEX idx_election_candidates_election_type ON election_candidates(election_type);
CREATE INDEX idx_voter_registrations_user_id ON voter_registrations(user_id);
CREATE INDEX idx_voter_registrations_constituency_id ON voter_registrations(constituency_id);
CREATE INDEX idx_voter_intent_surveys_user_id ON voter_intent_surveys(user_id);
CREATE INDEX idx_voter_intent_surveys_constituency_id ON voter_intent_surveys(constituency_id);
CREATE INDEX idx_user_votes_user_id ON user_votes(user_id);
CREATE INDEX idx_user_votes_voting_session_id ON user_votes(voting_session_id);
CREATE INDEX idx_voting_centers_constituency_id ON voting_centers(constituency_id);

-- Insert default admin user
INSERT INTO users (username, email, password_hash, full_name, is_active, is_verified) 
VALUES ('admin', 'admin@saasan.com', '$2b$10$example_hash_here', 'System Administrator', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert default admin user for development
INSERT INTO users (username, email, password_hash, full_name, is_active, is_verified) 
VALUES ('dev', 'dev@saasan.com', '$2b$10$example_hash_here', 'Development User', true, true)
ON CONFLICT (email) DO NOTHING;
`;

    // Write SQL to temporary file
    const sqlFile = path.join(backendPath, 'temp_create_tables.sql');
    fs.writeFileSync(sqlFile, createTablesSQL);

    try {
      // Execute SQL using psql or node script
      await runCommand('node', ['-e', `
        const db = require('./src/config/database');
        const fs = require('fs');
        const sql = fs.readFileSync('temp_create_tables.sql', 'utf8');
        
        db.raw(sql)
          .then(() => {
            console.log('✅ All tables created successfully');
            process.exit(0);
          })
          .catch((error) => {
            console.error('❌ Error creating tables:', error);
            process.exit(1);
          });
      `], backendPath);
    } finally {
      // Clean up temporary file
      if (fs.existsSync(sqlFile)) {
        fs.unlinkSync(sqlFile);
      }
    }

    log(`${colors.green}✅ All database tables created successfully!${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ Error creating tables: ${error.message}${colors.reset}`);
    throw error;
  }
}

async function seedAllData() {
  try {
    log(`${colors.bright}${colors.cyan}🌱 Seeding all data...${colors.reset}`);
    
    const backendPath = path.join(__dirname, '../saasan-node-be');
    await runCommand('npm', ['run', 'seed'], backendPath);
    
    log(`${colors.green}✅ All data seeded successfully!${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ Error seeding data: ${error.message}${colors.reset}`);
    throw error;
  }
}

async function setupCompleteDatabase() {
  try {
    log(`${colors.bright}${colors.magenta}🚀 Starting Complete Database Setup${colors.reset}`);
    log(`${colors.cyan}This will create all tables and seed all data${colors.reset}`);
    
    // Check if we're in the right directory
    if (!fs.existsSync(path.join(__dirname, '../saasan-node-be'))) {
      throw new Error('Please run this script from the project root directory');
    }

    // Step 1: Create all tables
    await createAllTables();
    
    // Step 2: Seed all data
    await seedAllData();
    
    log(`${colors.bright}${colors.green}🎉 Complete Database Setup Finished Successfully!${colors.reset}`);
    log(`${colors.cyan}✅ All tables created${colors.reset}`);
    log(`${colors.cyan}✅ All data seeded${colors.reset}`);
    log(`${colors.cyan}✅ Ready for development!${colors.reset}`);
    
  } catch (error) {
    log(`${colors.red}💥 Database setup failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupCompleteDatabase();
}

module.exports = { setupCompleteDatabase, createAllTables, seedAllData };
