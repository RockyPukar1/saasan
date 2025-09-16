-- Viral Features Database Schema

-- Badges system
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('reporter', 'voter', 'community', 'special')),
    rarity VARCHAR(20) NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    max_progress INTEGER DEFAULT 1,
    icon VARCHAR(100),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User badges
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Viral shares tracking
CREATE TABLE viral_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Viral items for tracking viral scores
CREATE TABLE viral_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    share_count INTEGER DEFAULT 0,
    viral_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(item_id, item_type)
);

-- User streaks
CREATE TABLE user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    daily_streak INTEGER DEFAULT 0,
    weekly_streak INTEGER DEFAULT 0,
    monthly_streak INTEGER DEFAULT 0,
    longest_daily_streak INTEGER DEFAULT 0,
    longest_weekly_streak INTEGER DEFAULT 0,
    total_days_active INTEGER DEFAULT 0,
    last_activity_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User activities for streak tracking
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity VARCHAR(100) NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Comments system
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Comment likes/dislikes
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vote VARCHAR(10) NOT NULL CHECK (vote IN ('up', 'down')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Comment reports
CREATE TABLE comment_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Feed reactions
CREATE TABLE feed_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(item_id, user_id)
);

-- Report reactions (for existing reports)
CREATE TABLE report_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(report_id, user_id)
);

-- Poll votes (if not already exists)
CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);

-- Verification system
CREATE TABLE verification_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'citizen_report' CHECK (status IN ('verified', 'under_review', 'pending', 'rejected', 'citizen_report')),
    level VARCHAR(10) NOT NULL DEFAULT 'low' CHECK (level IN ('high', 'medium', 'low')),
    verified_by VARCHAR(255),
    verified_at TIMESTAMP,
    evidence_count INTEGER DEFAULT 0,
    credibility_score INTEGER DEFAULT 0,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(item_id, item_type)
);

-- Verification votes
CREATE TABLE verification_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vote VARCHAR(10) NOT NULL CHECK (vote IN ('up', 'down')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(item_id, item_type, user_id)
);

-- Invite system
CREATE TABLE invite_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    inviter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    invitee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    platform VARCHAR(50),
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User invite stats
CREATE TABLE user_invite_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    friends_invited INTEGER DEFAULT 0,
    friends_joined INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    total_rewards INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Election data
CREATE TABLE elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    election_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Candidates
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    party VARCHAR(255),
    constituency VARCHAR(255),
    position VARCHAR(255),
    manifesto JSONB,
    rating DECIMAL(3,2) DEFAULT 0,
    promises INTEGER DEFAULT 0,
    achievements INTEGER DEFAULT 0,
    controversies INTEGER DEFAULT 0,
    is_incumbent BOOLEAN DEFAULT false,
    image_url VARCHAR(500),
    election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Candidate comparisons
CREATE TABLE candidate_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_ids UUID[] NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comparison_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Viral metrics
CREATE TABLE viral_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value INTEGER DEFAULT 0,
    period VARCHAR(20) NOT NULL, -- daily, weekly, monthly
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(metric_name, period, date)
);

-- Real-time updates
CREATE TABLE viral_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    update_type VARCHAR(50) NOT NULL,
    update_data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_viral_shares_item ON viral_shares(item_id, item_type);
CREATE INDEX idx_viral_shares_user ON viral_shares(user_id);
CREATE INDEX idx_viral_shares_created ON viral_shares(created_at);

CREATE INDEX idx_user_activities_user ON user_activities(user_id);
CREATE INDEX idx_user_activities_created ON user_activities(created_at);

CREATE INDEX idx_comments_item ON comments(item_id, item_type);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_created ON comments(created_at);

CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user ON comment_likes(user_id);

CREATE INDEX idx_verification_status_item ON verification_status(item_id, item_type);
CREATE INDEX idx_verification_votes_item ON verification_votes(item_id, item_type);

CREATE INDEX idx_poll_votes_poll ON poll_votes(poll_id);
CREATE INDEX idx_poll_votes_user ON poll_votes(user_id);

CREATE INDEX idx_viral_metrics_period ON viral_metrics(metric_name, period, date);
CREATE INDEX idx_viral_updates_user ON viral_updates(user_id, is_read);

-- Insert default badges
INSERT INTO badges (name, description, category, rarity, max_progress) VALUES
('Whistleblower', 'Submitted your first corruption report', 'reporter', 'common', 1),
('Corruption Hunter', 'Submitted 10 corruption reports', 'reporter', 'rare', 10),
('Justice Warrior', 'Submitted 50 corruption reports', 'reporter', 'epic', 50),
('Fact Checker', 'Had 5 reports verified by community', 'reporter', 'rare', 5),
('Voice of Change', 'Voted in your first poll', 'voter', 'common', 1),
('Poll Master', 'Voted in 25 polls', 'voter', 'rare', 25),
('Community Supporter', 'Upvoted 100 reports', 'community', 'rare', 100),
('Saasan Ambassador', 'Invited 5 friends to join', 'community', 'epic', 5),
('Loyal Citizen', 'Active for 30 days', 'special', 'legendary', 30);

-- Insert default election data
INSERT INTO elections (title, type, election_date, is_active) VALUES
('Federal Election 2024', 'Federal Election', '2024-04-10 08:00:00', true);

-- Create trigger to update viral scores when shares are tracked
CREATE OR REPLACE FUNCTION update_viral_score()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO viral_items (item_id, item_type, share_count, viral_score)
    VALUES (NEW.item_id, NEW.item_type, 1, 5)
    ON CONFLICT (item_id, item_type)
    DO UPDATE SET
        share_count = viral_items.share_count + 1,
        viral_score = viral_items.viral_score + 5,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_viral_score
    AFTER INSERT ON viral_shares
    FOR EACH ROW
    EXECUTE FUNCTION update_viral_score();

-- Create trigger to update streak when activity is recorded
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    current_date DATE := CURRENT_DATE;
    last_activity_date DATE;
    daily_streak_count INTEGER := 0;
BEGIN
    -- Get or create user streak record
    INSERT INTO user_streaks (user_id, last_activity_date)
    VALUES (NEW.user_id, current_date)
    ON CONFLICT (user_id)
    DO UPDATE SET
        last_activity_date = current_date,
        updated_at = NOW();
    
    -- Calculate daily streak
    SELECT last_activity_date INTO last_activity_date
    FROM user_streaks
    WHERE user_id = NEW.user_id;
    
    -- Update streak based on consecutive days
    UPDATE user_streaks
    SET daily_streak = CASE
        WHEN last_activity_date = current_date THEN daily_streak
        WHEN last_activity_date = current_date - INTERVAL '1 day' THEN daily_streak + 1
        ELSE 1
    END,
    longest_daily_streak = GREATEST(longest_daily_streak, daily_streak),
    total_days_active = total_days_active + 1,
    updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_streak
    AFTER INSERT ON user_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_user_streak();
