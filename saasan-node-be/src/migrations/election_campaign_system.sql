-- Election Campaign and Voting System Database Schema
-- This migration creates tables for the "This Holiday for My Country" campaign

-- Voter Registration and Intent Tracking
CREATE TABLE IF NOT EXISTS voter_registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    constituency_id INTEGER REFERENCES constituencies(id),
    ward_id INTEGER REFERENCES wards(id),
    registration_number VARCHAR(50) UNIQUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Voter Intent Survey
CREATE TABLE IF NOT EXISTS voter_intent_surveys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    constituency_id INTEGER REFERENCES constituencies(id),
    return_intent VARCHAR(20) NOT NULL, -- returning, unsure, cannot
    return_reason TEXT,
    voting_intent VARCHAR(20), -- will_vote, might_vote, will_not_vote
    preferred_candidate_id INTEGER REFERENCES politicians(id),
    concerns TEXT[],
    suggestions TEXT,
    survey_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Election Campaigns
CREATE TABLE IF NOT EXISTS election_campaigns (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_nepali VARCHAR(255),
    description TEXT,
    description_nepali TEXT,
    campaign_type VARCHAR(50) NOT NULL, -- voter_registration, awareness, get_out_vote
    target_constituency_id INTEGER REFERENCES constituencies(id),
    target_province_id INTEGER REFERENCES provinces(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    metrics JSONB, -- campaign statistics
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidate Profiles for Elections
CREATE TABLE IF NOT EXISTS election_candidates (
    id SERIAL PRIMARY KEY,
    politician_id INTEGER REFERENCES politicians(id),
    election_type VARCHAR(50) NOT NULL, -- federal, provincial, local
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

-- Candidate Comparisons
CREATE TABLE IF NOT EXISTS candidate_comparisons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    candidate_1_id INTEGER REFERENCES election_candidates(id),
    candidate_2_id INTEGER REFERENCES election_candidates(id),
    comparison_criteria JSONB, -- what was compared
    user_preference INTEGER, -- 1 or 2
    comparison_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Voting Sessions
CREATE TABLE IF NOT EXISTS voting_sessions (
    id SERIAL PRIMARY KEY,
    election_type VARCHAR(50) NOT NULL, -- federal, provincial
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

-- User Votes
CREATE TABLE IF NOT EXISTS user_votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    voting_session_id INTEGER REFERENCES voting_sessions(id),
    candidate_id INTEGER REFERENCES election_candidates(id),
    vote_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    device_fingerprint VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    verification_method VARCHAR(50), -- otp, biometric, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Voting Centers
CREATE TABLE IF NOT EXISTS voting_centers (
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
    facilities TEXT[], -- wheelchair_access, parking, etc.
    contact_person VARCHAR(255),
    contact_number VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign Analytics
CREATE TABLE IF NOT EXISTS campaign_analytics (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES election_campaigns(id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC,
    metric_date DATE NOT NULL,
    constituency_id INTEGER REFERENCES constituencies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_voter_registrations_user_id ON voter_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_voter_registrations_constituency_id ON voter_registrations(constituency_id);
CREATE INDEX IF NOT EXISTS idx_voter_intent_surveys_user_id ON voter_intent_surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_voter_intent_surveys_constituency_id ON voter_intent_surveys(constituency_id);
CREATE INDEX IF NOT EXISTS idx_election_candidates_constituency_id ON election_candidates(constituency_id);
CREATE INDEX IF NOT EXISTS idx_election_candidates_election_type ON election_candidates(election_type);
CREATE INDEX IF NOT EXISTS idx_user_votes_user_id ON user_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_votes_voting_session_id ON user_votes(voting_session_id);
CREATE INDEX IF NOT EXISTS idx_voting_centers_constituency_id ON voting_centers(constituency_id);
