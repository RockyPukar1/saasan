-- Add Nepali language support to all tables
-- This migration adds Nepali fields to existing tables for bilingual support

-- Add Nepali fields to provinces table
ALTER TABLE provinces 
ADD COLUMN IF NOT EXISTS name_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS capital_nepali VARCHAR(255);

-- Add Nepali fields to districts table
ALTER TABLE districts 
ADD COLUMN IF NOT EXISTS name_nepali VARCHAR(255);

-- Add Nepali fields to political_parties table
ALTER TABLE political_parties 
ADD COLUMN IF NOT EXISTS name_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_nepali TEXT;

-- Add Nepali fields to politicians table
ALTER TABLE politicians 
ADD COLUMN IF NOT EXISTS full_name_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS education_nepali TEXT,
ADD COLUMN IF NOT EXISTS previous_positions_nepali TEXT,
ADD COLUMN IF NOT EXISTS achievements_nepali TEXT,
ADD COLUMN IF NOT EXISTS promises_nepali TEXT[];

-- Add Nepali fields to corruption_reports table
ALTER TABLE corruption_reports 
ADD COLUMN IF NOT EXISTS title_nepali VARCHAR(500),
ADD COLUMN IF NOT EXISTS description_nepali TEXT,
ADD COLUMN IF NOT EXISTS evidence_nepali TEXT[],
ADD COLUMN IF NOT EXISTS involved_officials_nepali TEXT[],
ADD COLUMN IF NOT EXISTS impact_nepali TEXT;

-- Add Nepali fields to polls table
ALTER TABLE polls 
ADD COLUMN IF NOT EXISTS title_nepali VARCHAR(500),
ADD COLUMN IF NOT EXISTS description_nepali TEXT,
ADD COLUMN IF NOT EXISTS category_nepali VARCHAR(100);

-- Add Nepali fields to poll_options table
ALTER TABLE poll_options 
ADD COLUMN IF NOT EXISTS text_nepali VARCHAR(500);

-- Add Nepali fields to badges table
ALTER TABLE badges 
ADD COLUMN IF NOT EXISTS name_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_nepali TEXT;

-- Add Nepali fields to comments table
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS content_nepali TEXT;

-- Add Nepali fields to verification_status table
ALTER TABLE verification_status 
ADD COLUMN IF NOT EXISTS verified_by_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_notes_nepali TEXT;

-- Add Nepali fields to elections table
ALTER TABLE elections 
ADD COLUMN IF NOT EXISTS title_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS type_nepali VARCHAR(100);

-- Add Nepali fields to candidates table
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS name_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS party_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS constituency_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS position_nepali VARCHAR(255);

-- Add Nepali fields to categories table (if exists)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS name_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_nepali TEXT;

-- Add Nepali fields to positions table (if exists)
ALTER TABLE positions 
ADD COLUMN IF NOT EXISTS name_nepali VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_nepali TEXT;

-- Create indexes for Nepali fields for better search performance
CREATE INDEX IF NOT EXISTS idx_provinces_name_nepali ON provinces(name_nepali);
CREATE INDEX IF NOT EXISTS idx_districts_name_nepali ON districts(name_nepali);
CREATE INDEX IF NOT EXISTS idx_political_parties_name_nepali ON political_parties(name_nepali);
CREATE INDEX IF NOT EXISTS idx_politicians_full_name_nepali ON politicians(full_name_nepali);
CREATE INDEX IF NOT EXISTS idx_corruption_reports_title_nepali ON corruption_reports(title_nepali);
CREATE INDEX IF NOT EXISTS idx_polls_title_nepali ON polls(title_nepali);
CREATE INDEX IF NOT EXISTS idx_poll_options_text_nepali ON poll_options(text_nepali);
CREATE INDEX IF NOT EXISTS idx_badges_name_nepali ON badges(name_nepali);

-- Update existing data with Nepali translations where available
-- This will be handled by the seeding script, but we can add some basic fallbacks here

-- Create a function to get localized text with fallback
CREATE OR REPLACE FUNCTION get_localized_text(
    english_text TEXT,
    nepali_text TEXT,
    language VARCHAR(10) DEFAULT 'en'
)
RETURNS TEXT AS $$
BEGIN
    IF language = 'ne' AND nepali_text IS NOT NULL AND nepali_text != '' THEN
        RETURN nepali_text;
    ELSE
        RETURN COALESCE(english_text, '');
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get localized array with fallback
CREATE OR REPLACE FUNCTION get_localized_array(
    english_array TEXT[],
    nepali_array TEXT[],
    language VARCHAR(10) DEFAULT 'en'
)
RETURNS TEXT[] AS $$
BEGIN
    IF language = 'ne' AND nepali_array IS NOT NULL AND array_length(nepali_array, 1) > 0 THEN
        RETURN nepali_array;
    ELSE
        RETURN COALESCE(english_array, ARRAY[]::TEXT[]);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a view for bilingual provinces
CREATE OR REPLACE VIEW provinces_bilingual AS
SELECT 
    id,
    name,
    name_nepali,
    capital,
    capital_nepali,
    get_localized_text(name, name_nepali, 'en') as name_en,
    get_localized_text(name, name_nepali, 'ne') as name_ne,
    get_localized_text(capital, capital_nepali, 'en') as capital_en,
    get_localized_text(capital, capital_nepali, 'ne') as capital_ne,
    created_at,
    updated_at
FROM provinces;

-- Create a view for bilingual districts
CREATE OR REPLACE VIEW districts_bilingual AS
SELECT 
    d.id,
    d.name,
    d.name_nepali,
    d.province_id,
    p.name as province_name,
    p.name_nepali as province_name_nepali,
    get_localized_text(d.name, d.name_nepali, 'en') as name_en,
    get_localized_text(d.name, d.name_nepali, 'ne') as name_ne,
    get_localized_text(p.name, p.name_nepali, 'en') as province_name_en,
    get_localized_text(p.name, p.name_nepali, 'ne') as province_name_ne,
    d.created_at,
    d.updated_at
FROM districts d
LEFT JOIN provinces p ON d.province_id = p.id;

-- Create a view for bilingual political parties
CREATE OR REPLACE VIEW political_parties_bilingual AS
SELECT 
    id,
    name,
    name_nepali,
    symbol,
    color,
    get_localized_text(name, name_nepali, 'en') as name_en,
    get_localized_text(name, name_nepali, 'ne') as name_ne,
    created_at,
    updated_at
FROM political_parties;

-- Create a view for bilingual politicians
CREATE OR REPLACE VIEW politicians_bilingual AS
SELECT 
    p.id,
    p.full_name,
    p.full_name_nepali,
    p.position_id,
    p.constituency_id,
    p.party_id,
    pp.name as party_name,
    pp.name_nepali as party_name_nepali,
    d.name as constituency_name,
    d.name_nepali as constituency_name_nepali,
    get_localized_text(p.full_name, p.full_name_nepali, 'en') as full_name_en,
    get_localized_text(p.full_name, p.full_name_nepali, 'ne') as full_name_ne,
    get_localized_text(pp.name, pp.name_nepali, 'en') as party_name_en,
    get_localized_text(pp.name, pp.name_nepali, 'ne') as party_name_ne,
    get_localized_text(d.name, d.name_nepali, 'en') as constituency_name_en,
    get_localized_text(d.name, d.name_nepali, 'ne') as constituency_name_ne,
    p.experience_years,
    p.age,
    p.education,
    p.education_nepali,
    p.previous_positions,
    p.previous_positions_nepali,
    p.achievements,
    p.achievements_nepali,
    p.promises,
    p.promises_nepali,
    p.contact_info,
    p.created_at,
    p.updated_at
FROM politicians p
LEFT JOIN political_parties pp ON p.party_id = pp.id
LEFT JOIN districts d ON p.constituency_id = d.id;

-- Create a view for bilingual corruption reports
CREATE OR REPLACE VIEW corruption_reports_bilingual AS
SELECT 
    cr.id,
    cr.title,
    cr.title_nepali,
    cr.description,
    cr.description_nepali,
    cr.category,
    cr.priority,
    cr.status,
    cr.amount_involved,
    cr.location,
    cr.district_id,
    d.name as district_name,
    d.name_nepali as district_name_nepali,
    get_localized_text(cr.title, cr.title_nepali, 'en') as title_en,
    get_localized_text(cr.title, cr.title_nepali, 'ne') as title_ne,
    get_localized_text(cr.description, cr.description_nepali, 'en') as description_en,
    get_localized_text(cr.description, cr.description_nepali, 'ne') as description_ne,
    get_localized_text(d.name, d.name_nepali, 'en') as district_name_en,
    get_localized_text(d.name, d.name_nepali, 'ne') as district_name_ne,
    get_localized_array(cr.evidence, cr.evidence_nepali, 'en') as evidence_en,
    get_localized_array(cr.evidence, cr.evidence_nepali, 'ne') as evidence_ne,
    get_localized_array(cr.involved_officials, cr.involved_officials_nepali, 'en') as involved_officials_en,
    get_localized_array(cr.involved_officials, cr.involved_officials_nepali, 'ne') as involved_officials_ne,
    get_localized_text(cr.impact, cr.impact_nepali, 'en') as impact_en,
    get_localized_text(cr.impact, cr.impact_nepali, 'ne') as impact_ne,
    cr.reported_by,
    cr.reference_number,
    cr.upvotes_count,
    cr.downvotes_count,
    cr.created_at,
    cr.updated_at
FROM corruption_reports cr
LEFT JOIN districts d ON cr.district_id = d.id;

-- Create a view for bilingual polls
CREATE OR REPLACE VIEW polls_bilingual AS
SELECT 
    id,
    title,
    title_nepali,
    description,
    description_nepali,
    category,
    category_nepali,
    viral_potential,
    end_date,
    created_by,
    total_votes,
    get_localized_text(title, title_nepali, 'en') as title_en,
    get_localized_text(title, title_nepali, 'ne') as title_ne,
    get_localized_text(description, description_nepali, 'en') as description_en,
    get_localized_text(description, description_nepali, 'ne') as description_ne,
    get_localized_text(category, category_nepali, 'en') as category_en,
    get_localized_text(category, category_nepali, 'ne') as category_ne,
    created_at,
    updated_at
FROM polls;

-- Create a view for bilingual poll options
CREATE OR REPLACE VIEW poll_options_bilingual AS
SELECT 
    po.id,
    po.poll_id,
    po.option_id,
    po.text,
    po.text_nepali,
    po.votes,
    p.title as poll_title,
    p.title_nepali as poll_title_nepali,
    get_localized_text(po.text, po.text_nepali, 'en') as text_en,
    get_localized_text(po.text, po.text_nepali, 'ne') as text_ne,
    get_localized_text(p.title, p.title_nepali, 'en') as poll_title_en,
    get_localized_text(p.title, p.title_nepali, 'ne') as poll_title_ne,
    po.created_at
FROM poll_options po
LEFT JOIN polls p ON po.poll_id = p.id;

-- Create a view for bilingual badges
CREATE OR REPLACE VIEW badges_bilingual AS
SELECT 
    id,
    name,
    name_nepali,
    description,
    description_nepali,
    category,
    rarity,
    max_progress,
    icon,
    color,
    get_localized_text(name, name_nepali, 'en') as name_en,
    get_localized_text(name, name_nepali, 'ne') as name_ne,
    get_localized_text(description, description_nepali, 'en') as description_en,
    get_localized_text(description, description_nepali, 'ne') as description_ne,
    created_at,
    updated_at
FROM badges;

-- Create a view for bilingual comments
CREATE OR REPLACE VIEW comments_bilingual AS
SELECT 
    c.id,
    c.item_id,
    c.item_type,
    c.content,
    c.content_nepali,
    c.user_id,
    c.parent_id,
    u.full_name as author_name,
    get_localized_text(c.content, c.content_nepali, 'en') as content_en,
    get_localized_text(c.content, c.content_nepali, 'ne') as content_ne,
    c.created_at,
    c.updated_at
FROM comments c
LEFT JOIN users u ON c.user_id = u.id;

-- Add comments to the migration log
COMMENT ON FUNCTION get_localized_text IS 'Returns localized text with fallback to English';
COMMENT ON FUNCTION get_localized_array IS 'Returns localized array with fallback to English';
COMMENT ON VIEW provinces_bilingual IS 'Bilingual view of provinces with fallback logic';
COMMENT ON VIEW districts_bilingual IS 'Bilingual view of districts with fallback logic';
COMMENT ON VIEW political_parties_bilingual IS 'Bilingual view of political parties with fallback logic';
COMMENT ON VIEW politicians_bilingual IS 'Bilingual view of politicians with fallback logic';
COMMENT ON VIEW corruption_reports_bilingual IS 'Bilingual view of corruption reports with fallback logic';
COMMENT ON VIEW polls_bilingual IS 'Bilingual view of polls with fallback logic';
COMMENT ON VIEW poll_options_bilingual IS 'Bilingual view of poll options with fallback logic';
COMMENT ON VIEW badges_bilingual IS 'Bilingual view of badges with fallback logic';
COMMENT ON VIEW comments_bilingual IS 'Bilingual view of comments with fallback logic';
