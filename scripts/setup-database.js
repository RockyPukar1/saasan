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
    
    // Load environment variables
    require('dotenv').config({ path: path.join(backendPath, '.env') });
    
    // Create database connection using knex directly
    const knex = require('knex');
    const db = knex({
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'saasan',
      },
    });
    
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
    district VARCHAR(100),
    municipality VARCHAR(100),
    ward_number INTEGER,
    constituency_id INTEGER,
    role VARCHAR(50) DEFAULT 'citizen',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_active_at TIMESTAMP,
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

-- Create Levels table
CREATE TABLE levels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_nepali VARCHAR(100),
    description TEXT,
    description_nepali TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Positions table
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    title_nepali VARCHAR(100),
    level_id INTEGER REFERENCES levels(id),
    description TEXT,
    description_nepali TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Corruption Reports table
CREATE TABLE corruption_reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_nepali VARCHAR(255),
    description TEXT,
    description_nepali TEXT,
    category VARCHAR(50),
    category_nepali VARCHAR(50),
    constituency_id INTEGER REFERENCES constituencies(id),
    reporter_id INTEGER REFERENCES users(id),
    amount_involved DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    upvotes_count INTEGER DEFAULT 0,
    downvotes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    reference_number VARCHAR(50),
    tags TEXT[],
    tags_nepali TEXT[],
    verification_notes TEXT,
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    is_public BOOLEAN DEFAULT false,
    assigned_to_officer_id INTEGER,
    district VARCHAR(100),
    municipality VARCHAR(100),
    ward_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Service Status table
CREATE TABLE service_status (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    service_name_nepali VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    description_nepali TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Historical Events table
CREATE TABLE historical_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_nepali VARCHAR(255),
    description TEXT,
    description_nepali TEXT,
    category VARCHAR(100),
    category_nepali VARCHAR(100),
    year INTEGER,
    date DATE,
    location VARCHAR(255),
    location_nepali VARCHAR(255),
    significance TEXT,
    significance_nepali TEXT,
    source_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Note: Admin users are created via JavaScript seeding in seedUsers() function
`;

    // Execute SQL directly using the database connection
    await db.raw(createTablesSQL);
    
    // Close database connection
    await db.destroy();
    
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
    
    // Load environment variables
    require('dotenv').config({ path: path.join(backendPath, '.env') });
    
    // Create database connection
    const knex = require('knex');
    const db = knex({
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'saasan',
      },
    });

    // Comprehensive Nepali Data
    const completeData = {
      provinces: [
        { id: 1, name: "Koshi Province", name_nepali: "कोशी प्रदेश", capital: "Biratnagar", capital_nepali: "विराटनगर" },
        { id: 2, name: "Madhesh Province", name_nepali: "मधेश प्रदेश", capital: "Janakpur", capital_nepali: "जनकपुर" },
        { id: 3, name: "Bagmati Province", name_nepali: "बागमती प्रदेश", capital: "Kathmandu", capital_nepali: "काठमाडौं" },
        { id: 4, name: "Gandaki Province", name_nepali: "गण्डकी प्रदेश", capital: "Pokhara", capital_nepali: "पोखरा" },
        { id: 5, name: "Lumbini Province", name_nepali: "लुम्बिनी प्रदेश", capital: "Deukhuri", capital_nepali: "देउखुरी" },
        { id: 6, name: "Karnali Province", name_nepali: "कर्णाली प्रदेश", capital: "Birendranagar", capital_nepali: "वीरेन्द्रनगर" },
        { id: 7, name: "Sudurpashchim Province", name_nepali: "सुदूरपश्चिम प्रदेश", capital: "Dhangadhi", capital_nepali: "धनगढी" }
      ],

      districts: [
        { id: 1, name: "Kathmandu", name_nepali: "काठमाडौं", province_id: 3 },
        { id: 2, name: "Lalitpur", name_nepali: "ललितपुर", province_id: 3 },
        { id: 3, name: "Bhaktapur", name_nepali: "भक्तपुर", province_id: 3 },
        { id: 4, name: "Chitwan", name_nepali: "चितवन", province_id: 3 },
        { id: 5, name: "Makwanpur", name_nepali: "मकवानपुर", province_id: 3 },
        { id: 6, name: "Kaski", name_nepali: "कास्की", province_id: 4 },
        { id: 7, name: "Syangja", name_nepali: "स्याङ्जा", province_id: 4 },
        { id: 8, name: "Banke", name_nepali: "बाँके", province_id: 5 },
        { id: 9, name: "Bardiya", name_nepali: "बर्दिया", province_id: 5 },
        { id: 10, name: "Morang", name_nepali: "मोरङ", province_id: 1 },
        { id: 11, name: "Sunsari", name_nepali: "सुनसरी", province_id: 1 }
      ],

      constituencies: [
        { id: 1, name: "Kathmandu-1", name_nepali: "काठमाडौं-१", district_id: 1, province_id: 3, total_voters: 45000 },
        { id: 2, name: "Kathmandu-2", name_nepali: "काठमाडौं-२", district_id: 1, province_id: 3, total_voters: 42000 },
        { id: 3, name: "Kathmandu-3", name_nepali: "काठमाडौं-३", district_id: 1, province_id: 3, total_voters: 48000 },
        { id: 4, name: "Lalitpur-1", name_nepali: "ललितपुर-१", district_id: 2, province_id: 3, total_voters: 38000 },
        { id: 5, name: "Bhaktapur", name_nepali: "भक्तपुर", district_id: 3, province_id: 3, total_voters: 35000 },
        { id: 6, name: "Pokhara-1", name_nepali: "पोखरा-१", district_id: 6, province_id: 4, total_voters: 40000 },
        { id: 7, name: "Chitwan", name_nepali: "चितवन", district_id: 4, province_id: 3, total_voters: 42000 },
        { id: 8, name: "Biratnagar", name_nepali: "विराटनगर", district_id: 10, province_id: 1, total_voters: 43000 },
        { id: 9, name: "Nepalgunj", name_nepali: "नेपालगञ्ज", district_id: 8, province_id: 5, total_voters: 38000 }
      ],

      politicalParties: [
        {
          id: 1,
          name: "Nepal Communist Party (Unified Marxist-Leninist)",
          name_nepali: "नेपाल कम्युनिस्ट पार्टी (एकीकृत मार्क्सवादी-लेनिनवादी)",
          abbreviation: "CPN-UML",
          abbreviation_nepali: "नेकपा-एमाले",
          ideology: "Communism",
          ideology_nepali: "कम्युनिज्म",
          founded_year: 2021,
          logo_url: "https://example.com/cpn-uml-logo.png",
          color: "#FF0000"
        },
        {
          id: 2,
          name: "Nepali Congress",
          name_nepali: "नेपाली कांग्रेस",
          abbreviation: "NC",
          abbreviation_nepali: "नेकां",
          ideology: "Social Democracy",
          ideology_nepali: "सामाजिक लोकतन्त्र",
          founded_year: 1950,
          logo_url: "https://example.com/nc-logo.png",
          color: "#0066CC"
        },
        {
          id: 3,
          name: "Maoist Center",
          name_nepali: "माओवादी केन्द्र",
          abbreviation: "MC",
          abbreviation_nepali: "माके",
          ideology: "Maoism",
          ideology_nepali: "माओवाद",
          founded_year: 1994,
          logo_url: "https://example.com/mc-logo.png",
          color: "#FF6600"
        },
        {
          id: 4,
          name: "Rastriya Prajatantra Party",
          name_nepali: "राष्ट्रिय प्रजातन्त्र पार्टी",
          abbreviation: "RPP",
          abbreviation_nepali: "राप्रपा",
          ideology: "Monarchism",
          ideology_nepali: "राजतन्त्रवाद",
          founded_year: 1990,
          logo_url: "https://example.com/rpp-logo.png",
          color: "#FFD700"
        },
        {
          id: 5,
          name: "Janata Samajwadi Party",
          name_nepali: "जनता समाजवादी पार्टी",
          abbreviation: "JSP",
          abbreviation_nepali: "जसपा",
          ideology: "Socialism",
          ideology_nepali: "समाजवाद",
          founded_year: 2020,
          logo_url: "https://example.com/jsp-logo.png",
          color: "#00AA00"
        }
      ],

      politicians: [
        {
          id: 1,
          full_name: "Dr. Rajesh Sharma",
          full_name_nepali: "डा. राजेश शर्मा",
          age: 45,
          education: "PhD in Computer Science, Harvard University",
          education_nepali: "कम्प्युटर साइन्समा पिएचडी, हार्वर्ड विश्वविद्यालय",
          profession: "Technology Entrepreneur",
          profession_nepali: "प्रविधि उद्यमी",
          constituency_id: 1,
          party_id: 1,
          position: "Member of Parliament",
          position_nepali: "संसद सदस्य",
          experience_years: 8,
          photo_url: "https://example.com/rajesh-sharma.jpg",
          is_active: true,
          rating: 4.2,
          total_reports: 12,
          verified_reports: 8
        },
        {
          id: 2,
          full_name: "Sita Maharjan",
          full_name_nepali: "सीता महर्जन",
          age: 38,
          education: "Masters in Environmental Science, Tribhuvan University",
          education_nepali: "वातावरण विज्ञानमा स्नातकोत्तर, त्रिभुवन विश्वविद्यालय",
          profession: "Environmental Activist",
          profession_nepali: "वातावरण कार्यकर्ता",
          constituency_id: 1,
          party_id: 2,
          position: "Member of Parliament",
          position_nepali: "संसद सदस्य",
          experience_years: 5,
          photo_url: "https://example.com/sita-maharjan.jpg",
          is_active: true,
          rating: 4.5,
          total_reports: 8,
          verified_reports: 6
        }
      ]
    };

    // Seed Provinces
    log('📍 Seeding provinces...');
    for (const province of completeData.provinces) {
      await db('provinces').insert(province).onConflict('id').ignore();
    }

    // Seed Districts
    log('🏘️ Seeding districts...');
    for (const district of completeData.districts) {
      await db('districts').insert(district).onConflict('id').ignore();
    }

    // Seed Constituencies
    log('🗳️ Seeding constituencies...');
    for (const constituency of completeData.constituencies) {
      await db('constituencies').insert(constituency).onConflict('id').ignore();
    }

    // Seed Political Parties
    log('🏛️ Seeding political parties...');
    for (const party of completeData.politicalParties) {
      await db('political_parties').insert(party).onConflict('id').ignore();
    }

    // Seed Politicians
    log('👥 Seeding politicians...');
    for (const politician of completeData.politicians) {
      await db('politicians').insert(politician).onConflict('id').ignore();
    }

    // Close database connection
    await db.destroy();
    
    log(`${colors.green}✅ All data seeded successfully!${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ Error seeding data: ${error.message}${colors.reset}`);
    throw error;
  }
}

async function seedAdditionalData() {
  try {
    log(`${colors.bright}${colors.cyan}🌱 Seeding additional data...${colors.reset}`);
    
    const backendPath = path.join(__dirname, '../saasan-node-be');
    
    // Load environment variables
    require('dotenv').config({ path: path.join(backendPath, '.env') });
    
    // Create database connection
    const knex = require('knex');
    const db = knex({
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'saasan',
      },
    });

    // Seed Levels
    log('📊 Seeding government levels...');
    const levels = [
      { id: 1, name: "Federal", name_nepali: "संघीय", description: "Federal level positions", description_nepali: "संघीय स्तरका पदहरू" },
      { id: 2, name: "Provincial", name_nepali: "प्रदेश", description: "Provincial level positions", description_nepali: "प्रदेश स्तरका पदहरू" },
      { id: 3, name: "Local", name_nepali: "स्थानीय", description: "Local level positions", description_nepali: "स्थानीय स्तरका पदहरू" },
      { id: 4, name: "Municipal", name_nepali: "नगरपालिका", description: "Municipal level positions", description_nepali: "नगरपालिका स्तरका पदहरू" }
    ];
    
    for (const level of levels) {
      await db('levels').insert(level).onConflict('id').ignore();
    }

    // Seed Positions
    log('👔 Seeding positions...');
    const positions = [
      { id: 1, title: "Prime Minister", title_nepali: "प्रधानमन्त्री", level_id: 1, description: "Head of Government", description_nepali: "सरकारका प्रमुख" },
      { id: 2, title: "Minister", title_nepali: "मन्त्री", level_id: 1, description: "Cabinet Minister", description_nepali: "मन्त्रिपरिषदका सदस्य" },
      { id: 3, title: "Member of Parliament", title_nepali: "संसद सदस्य", level_id: 1, description: "Federal Parliament Member", description_nepali: "संघीय संसदका सदस्य" },
      { id: 4, title: "Chief Minister", title_nepali: "मुख्यमन्त्री", level_id: 2, description: "Provincial Head", description_nepali: "प्रदेशका प्रमुख" },
      { id: 5, title: "Mayor", title_nepali: "मेयर", level_id: 4, description: "Municipal Head", description_nepali: "नगरपालिकाका प्रमुख" },
      { id: 6, title: "Ward Chairperson", title_nepali: "वडा अध्यक्ष", level_id: 3, description: "Ward Level Head", description_nepali: "वडा स्तरका प्रमुख" }
    ];
    
    for (const position of positions) {
      await db('positions').insert(position).onConflict('id').ignore();
    }

    // Seed Service Status
    log('🔧 Seeding service status...');
    const serviceStatus = [
      { id: 1, service_name: "Database", service_name_nepali: "डेटाबेस", status: "operational", description: "Main database service", description_nepali: "मुख्य डेटाबेस सेवा" },
      { id: 2, service_name: "API", service_name_nepali: "एपीआई", status: "operational", description: "REST API service", description_nepali: "रेस्ट एपीआई सेवा" },
      { id: 3, service_name: "Authentication", service_name_nepali: "प्रमाणीकरण", status: "operational", description: "User authentication service", description_nepali: "प्रयोगकर्ता प्रमाणीकरण सेवा" },
      { id: 4, service_name: "File Upload", service_name_nepali: "फाइल अपलोड", status: "operational", description: "File upload service", description_nepali: "फाइल अपलोड सेवा" },
      { id: 5, service_name: "Email", service_name_nepali: "इमेल", status: "maintenance", description: "Email notification service", description_nepali: "इमेल सूचना सेवा" }
    ];
    
    for (const service of serviceStatus) {
      await db('service_status').insert(service).onConflict('id').ignore();
    }

    // Seed Sample Corruption Reports
    log('📋 Seeding sample corruption reports...');
    const sampleReports = [
      {
        id: 1,
        title: "Road Construction Corruption",
        title_nepali: "सडक निर्माण भ्रष्टाचार",
        description: "Allegations of corruption in road construction project",
        description_nepali: "सडक निर्माण परियोजनामा भ्रष्टाचारको आरोप",
        category: "Infrastructure",
        category_nepali: "पूर्वाधार",
        constituency_id: 1,
        reporter_id: 1,
        amount_involved: 5000000,
        status: "under_investigation",
        priority: "high",
        upvotes_count: 15,
        downvotes_count: 2,
        views_count: 45,
        is_public: true,
        district: "Kathmandu",
        municipality: "Kathmandu Metropolitan City",
        ward_number: 1,
        tags: ["corruption", "infrastructure", "construction"],
        tags_nepali: ["भ्रष्टाचार", "पूर्वाधार", "निर्माण"]
      },
      {
        id: 2,
        title: "Education Fund Misuse",
        title_nepali: "शिक्षा कोषको दुरुपयोग",
        description: "Misuse of education development fund",
        description_nepali: "शिक्षा विकास कोषको दुरुपयोग",
        category: "Education",
        category_nepali: "शिक्षा",
        constituency_id: 2,
        reporter_id: 2,
        amount_involved: 2000000,
        status: "verified",
        priority: "medium",
        upvotes_count: 8,
        downvotes_count: 1,
        views_count: 23,
        is_public: true,
        district: "Lalitpur",
        municipality: "Lalitpur Metropolitan City",
        ward_number: 1,
        tags: ["corruption", "education", "funds"],
        tags_nepali: ["भ्रष्टाचार", "शिक्षा", "कोष"]
      }
    ];
    
    for (const report of sampleReports) {
      await db('corruption_reports').insert(report).onConflict('id').ignore();
    }

    // Seed Sample Historical Events
    log('📚 Seeding sample historical events...');
    const sampleEvents = [
      {
        id: 1,
        title: "People's Movement 1990",
        title_nepali: "जनआन्दोलन १९९०",
        description: "Mass movement that restored multi-party democracy in Nepal",
        description_nepali: "नेपालमा बहुदलीय लोकतन्त्र पुनर्स्थापना गर्ने जनआन्दोलन",
        category: "Political",
        category_nepali: "राजनीतिक",
        year: 1990,
        date: "1990-04-06",
        location: "Kathmandu",
        location_nepali: "काठमाडौं",
        significance: "Ended absolute monarchy and established constitutional monarchy",
        significance_nepali: "निरंकुश राजतन्त्रको अन्त्य र संवैधानिक राजतन्त्रको स्थापना",
        is_verified: true
      },
      {
        id: 2,
        title: "Maoist Insurgency",
        title_nepali: "माओवादी विद्रोह",
        description: "10-year armed conflict between Maoist rebels and government",
        description_nepali: "माओवादी विद्रोही र सरकार बीच १० वर्षको सशस्त्र संघर्ष",
        category: "Conflict",
        category_nepali: "संघर्ष",
        year: 1996,
        date: "1996-02-13",
        location: "Rolpa",
        location_nepali: "रोल्पा",
        significance: "Led to the end of monarchy and establishment of republic",
        significance_nepali: "राजतन्त्रको अन्त्य र गणतन्त्रको स्थापनामा नेतृत्व",
        is_verified: true
      }
    ];
    
    for (const event of sampleEvents) {
      await db('historical_events').insert(event).onConflict('id').ignore();
    }

    // Close database connection
    await db.destroy();
    
    log(`${colors.green}✅ Additional data seeded successfully!${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ Error seeding additional data: ${error.message}${colors.reset}`);
    throw error;
  }
}

async function seedUsers() {
  try {
    log(`${colors.bright}${colors.cyan}👥 Seeding users with different roles...${colors.reset}`);
    
    const backendPath = path.join(__dirname, '../saasan-node-be');
    
    // Load environment variables
    require('dotenv').config({ path: path.join(backendPath, '.env') });
    
    // Create database connection
    const knex = require('knex');
    const db = knex({
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'saasan',
      },
    });

    // Hash password function
    const hashPassword = async (password) => {
      return await require('bcrypt').hash(password, 10);
    };

    // Define users with different roles
    const users = [
      // Admin users
      {
        username: 'admin',
        email: 'admin@saasan.com',
        password: 'admin123',
        full_name: 'System Administrator',
        role: 'admin',
        phone: '+977-1-1234567',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 1,
        is_active: true,
        is_verified: true
      },
      {
        username: 'superadmin',
        email: 'superadmin@saasan.com',
        password: 'superadmin123',
        full_name: 'Super Administrator',
        role: 'superadmin',
        phone: '+977-1-1234568',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 1,
        is_active: true,
        is_verified: true
      },
      
      // Moderator users
      {
        username: 'moderator1',
        email: 'moderator1@saasan.com',
        password: 'moderator123',
        full_name: 'Content Moderator',
        role: 'moderator',
        phone: '+977-1-1234569',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 2,
        is_active: true,
        is_verified: true
      },
      {
        username: 'moderator2',
        email: 'moderator2@saasan.com',
        password: 'moderator123',
        full_name: 'Community Moderator',
        role: 'moderator',
        phone: '+977-1-1234570',
        district: 'Lalitpur',
        municipality: 'Lalitpur Metropolitan City',
        ward_number: 1,
        is_active: true,
        is_verified: true
      },
      
      // Campaign Manager users
      {
        username: 'campaign_manager1',
        email: 'campaign1@saasan.com',
        password: 'campaign123',
        full_name: 'Election Campaign Manager',
        role: 'campaign_manager',
        phone: '+977-1-1234571',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 3,
        is_active: true,
        is_verified: true
      },
      {
        username: 'campaign_manager2',
        email: 'campaign2@saasan.com',
        password: 'campaign123',
        full_name: 'Political Campaign Manager',
        role: 'campaign_manager',
        phone: '+977-1-1234572',
        district: 'Pokhara',
        municipality: 'Pokhara Metropolitan City',
        ward_number: 1,
        is_active: true,
        is_verified: true
      },
      
      // Journalist users
      {
        username: 'journalist1',
        email: 'journalist1@saasan.com',
        password: 'journalist123',
        full_name: 'Political Journalist',
        role: 'journalist',
        phone: '+977-1-1234573',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 4,
        is_active: true,
        is_verified: true
      },
      {
        username: 'journalist2',
        email: 'journalist2@saasan.com',
        password: 'journalist123',
        full_name: 'Investigative Journalist',
        role: 'journalist',
        phone: '+977-1-1234574',
        district: 'Lalitpur',
        municipality: 'Lalitpur Metropolitan City',
        ward_number: 2,
        is_active: true,
        is_verified: true
      },
      
      // Citizen users
      {
        username: 'citizen1',
        email: 'citizen1@saasan.com',
        password: 'citizen123',
        full_name: 'Ram Bahadur Thapa',
        role: 'citizen',
        phone: '+977-1-1234575',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 5,
        is_active: true,
        is_verified: true
      },
      {
        username: 'citizen2',
        email: 'citizen2@saasan.com',
        password: 'citizen123',
        full_name: 'Sita Devi Maharjan',
        role: 'citizen',
        phone: '+977-1-1234576',
        district: 'Lalitpur',
        municipality: 'Lalitpur Metropolitan City',
        ward_number: 3,
        is_active: true,
        is_verified: true
      },
      {
        username: 'citizen3',
        email: 'citizen3@saasan.com',
        password: 'citizen123',
        full_name: 'Hari Prasad Sharma',
        role: 'citizen',
        phone: '+977-1-1234577',
        district: 'Bhaktapur',
        municipality: 'Bhaktapur Municipality',
        ward_number: 1,
        is_active: true,
        is_verified: true
      },
      {
        username: 'citizen4',
        email: 'citizen4@saasan.com',
        password: 'citizen123',
        full_name: 'Gita Kumari Tamang',
        role: 'citizen',
        phone: '+977-1-1234578',
        district: 'Pokhara',
        municipality: 'Pokhara Metropolitan City',
        ward_number: 2,
        is_active: true,
        is_verified: true
      },
      
      // Politician users
      {
        username: 'politician1',
        email: 'politician1@saasan.com',
        password: 'politician123',
        full_name: 'Dr. Rajesh Sharma',
        role: 'politician',
        phone: '+977-1-1234579',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 1,
        is_active: true,
        is_verified: true
      },
      {
        username: 'politician2',
        email: 'politician2@saasan.com',
        password: 'politician123',
        full_name: 'Sita Maharjan',
        role: 'politician',
        phone: '+977-1-1234580',
        district: 'Lalitpur',
        municipality: 'Lalitpur Metropolitan City',
        ward_number: 1,
        is_active: true,
        is_verified: true
      },
      
      // NGO users
      {
        username: 'ngo1',
        email: 'ngo1@saasan.com',
        password: 'ngo123',
        full_name: 'Transparency Nepal',
        role: 'ngo',
        phone: '+977-1-1234581',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 6,
        is_active: true,
        is_verified: true
      },
      {
        username: 'ngo2',
        email: 'ngo2@saasan.com',
        password: 'ngo123',
        full_name: 'Citizens for Democracy',
        role: 'ngo',
        phone: '+977-1-1234582',
        district: 'Lalitpur',
        municipality: 'Lalitpur Metropolitan City',
        ward_number: 4,
        is_active: true,
        is_verified: true
      }
    ];

    // Clear existing users
    log('🗑️ Clearing existing users...');
    await db('users').del();

    // Insert users
    log('👤 Creating users...');
    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      
      const userData = {
        username: user.username,
        email: user.email,
        password_hash: hashedPassword,
        full_name: user.full_name,
        role: user.role,
        phone: user.phone,
        district: user.district,
        municipality: user.municipality,
        ward_number: user.ward_number,
        is_active: user.is_active,
        is_verified: user.is_verified,
        last_active_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      };

      await db('users').insert(userData).onConflict('email').ignore();
      
      log(`✅ Created ${user.role}: ${user.email} (password: ${user.password})`, colors.green);
    }

    // Close database connection
    await db.destroy();
    
    log(`${colors.bright}${colors.green}🎉 All users seeded successfully!${colors.reset}`);
    log(`${colors.cyan}📋 Login Credentials:${colors.reset}`);
    log(`${colors.yellow}┌─────────────────────────────────────────────────────────────┐${colors.reset}`);
    log(`${colors.yellow}│ Role              │ Email                    │ Password        │${colors.reset}`);
    log(`${colors.yellow}├─────────────────────────────────────────────────────────────┤${colors.reset}`);
    log(`${colors.yellow}│ Super Admin       │ superadmin@saasan.com    │ superadmin123   │${colors.reset}`);
    log(`${colors.yellow}│ Admin             │ admin@saasan.com         │ admin123        │${colors.reset}`);
    log(`${colors.yellow}│ Moderator         │ moderator1@saasan.com    │ moderator123    │${colors.reset}`);
    log(`${colors.yellow}│ Campaign Manager  │ campaign1@saasan.com     │ campaign123     │${colors.reset}`);
    log(`${colors.yellow}│ Journalist        │ journalist1@saasan.com   │ journalist123   │${colors.reset}`);
    log(`${colors.yellow}│ Citizen           │ citizen1@saasan.com      │ citizen123      │${colors.reset}`);
    log(`${colors.yellow}│ Politician        │ politician1@saasan.com   │ politician123   │${colors.reset}`);
    log(`${colors.yellow}│ NGO               │ ngo1@saasan.com          │ ngo123          │${colors.reset}`);
    log(`${colors.yellow}└─────────────────────────────────────────────────────────────┘${colors.reset}`);
    
  } catch (error) {
    log(`${colors.red}❌ Error seeding users: ${error.message}${colors.reset}`);
    throw error;
  }
}

async function createDatabaseIfNotExists() {
  try {
    const backendPath = path.join(__dirname, '../saasan-node-be');
    const envPath = path.join(backendPath, '.env');
    require('dotenv').config({ path: envPath, override: true });
    
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    };
    
    const dbName = process.env.DB_NAME || 'saasan';
    
    log(`${colors.yellow}🔍 Checking if database '${dbName}' exists...${colors.reset}`);
    
    // Connect to postgres database to create our database
    const knex = require('knex');
    const adminDb = knex({
      client: 'postgresql',
      connection: {
        ...dbConfig,
        database: 'postgres', // Connect to default postgres db
      },
    });
    
    // Check if database exists
    const result = await adminDb.raw("SELECT 1 FROM pg_database WHERE datname = ?", [dbName]);
    
    if (result.rows.length === 0) {
      log(`${colors.yellow}📝 Creating database '${dbName}'...${colors.reset}`);
      await adminDb.raw(`CREATE DATABASE "${dbName}"`);
      log(`${colors.green}✅ Database '${dbName}' created successfully!${colors.reset}`);
    } else {
      log(`${colors.green}✅ Database '${dbName}' already exists!${colors.reset}`);
    }
    
    await adminDb.destroy();
  } catch (error) {
    log(`${colors.red}❌ Error creating database: ${error.message}${colors.reset}`);
    throw error;
  }
}

async function setupCompleteDatabase() {
  try {
    log(`${colors.bright}${colors.magenta}🚀 Starting Complete Database Setup${colors.reset}`);
    log(`${colors.cyan}This will create database, tables, and seed all data${colors.reset}`);
    
    // Check if we're in the right directory
    if (!fs.existsSync(path.join(__dirname, '../saasan-node-be'))) {
      throw new Error('Please run this script from the project root directory');
    }

    // Step 1: Create database if it doesn't exist
    await createDatabaseIfNotExists();
    
    // Step 2: Create all tables
    await createAllTables();
    
    // Step 3: Seed all data
    await seedAllData();
    
    // Step 4: Seed additional data (levels, positions, service status, sample reports)
    await seedAdditionalData();
    
    // Step 5: Seed users with different roles
    await seedUsers();
    
    log(`${colors.bright}${colors.green}🎉 Complete Database Setup Finished Successfully!${colors.reset}`);
    log(`${colors.cyan}✅ Database created${colors.reset}`);
    log(`${colors.cyan}✅ All tables created${colors.reset}`);
    log(`${colors.cyan}✅ All data seeded${colors.reset}`);
    log(`${colors.cyan}✅ Users with different roles created${colors.reset}`);
    log(`${colors.cyan}✅ Ready for development!${colors.reset}`);
    
  } catch (error) {
    log(`${colors.red}💥 Database setup failed: ${error.message}${colors.reset}`);
    if (error.message.includes('password authentication failed')) {
      log(`${colors.yellow}💡 Make sure PostgreSQL is running and the credentials in saasan-node-be/.env are correct${colors.reset}`);
      log(`${colors.yellow}💡 Default credentials: user=postgres, password=postgres${colors.reset}`);
    }
    process.exit(1);
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupCompleteDatabase();
}

module.exports = { setupCompleteDatabase, createAllTables, seedAllData };
