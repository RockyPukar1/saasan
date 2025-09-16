-- Create major_cases table
CREATE TABLE IF NOT EXISTS major_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unsolved' CHECK (status IN ('unsolved', 'ongoing', 'solved')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    amount_involved DECIMAL(15,2) NOT NULL DEFAULT 0,
    upvotes_count INTEGER DEFAULT 0,
    downvotes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    category_id INTEGER,
    reporter_id VARCHAR(50),
    is_anonymous BOOLEAN DEFAULT false,
    location_description VARCHAR(500),
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    district VARCHAR(100),
    municipality VARCHAR(100),
    ward VARCHAR(10),
    assigned_to_officer_id VARCHAR(50),
    date_occurred DATE,
    people_affected_count INTEGER DEFAULT 0,
    public_visibility VARCHAR(50),
    resolved_at TIMESTAMP,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_major_cases_status ON major_cases(status);
CREATE INDEX IF NOT EXISTS idx_major_cases_priority ON major_cases(priority);
CREATE INDEX IF NOT EXISTS idx_major_cases_reference ON major_cases(reference_number);
CREATE INDEX IF NOT EXISTS idx_major_cases_created_at ON major_cases(created_at);
CREATE INDEX IF NOT EXISTS idx_major_cases_reporter ON major_cases(reporter_id);
CREATE INDEX IF NOT EXISTS idx_major_cases_category ON major_cases(category_id);
CREATE INDEX IF NOT EXISTS idx_major_cases_public ON major_cases(is_public);

-- Insert sample major cases
INSERT INTO major_cases (
    reference_number,
    title,
    description,
    status,
    priority,
    amount_involved,
    upvotes_count,
    views_count,
    shares_count,
    district,
    municipality,
    date_occurred,
    people_affected_count,
    is_public
) VALUES 
(
    'MC-2024-001',
    'Corruption in Road Construction Project',
    'Massive corruption discovered in the construction of the Kathmandu-Pokhara highway. Contractors used substandard materials and inflated costs by 300%. The project was supposed to cost 2 billion NPR but actual costs were only 600 million NPR.',
    'ongoing',
    'urgent',
    1400000000.00,
    1250,
    15420,
    890,
    'Kathmandu',
    'Kathmandu Metropolitan City',
    '2024-01-15',
    500000,
    true
),
(
    'MC-2024-002',
    'Education Ministry Textbook Scam',
    'Corruption in textbook procurement for public schools. Officials awarded contracts to companies with political connections, resulting in poor quality books and overpricing. Students received damaged and incomplete textbooks.',
    'solved',
    'high',
    500000000.00,
    2100,
    22300,
    1200,
    'Bagmati',
    'Lalitpur Metropolitan City',
    '2023-11-20',
    2000000,
    true
),
(
    'MC-2024-003',
    'Healthcare Equipment Procurement Fraud',
    'Corruption in procurement of medical equipment for government hospitals. Equipment was purchased at inflated prices and many items were never delivered. This affected patient care across multiple districts.',
    'unsolved',
    'urgent',
    800000000.00,
    890,
    12300,
    450,
    'Gandaki',
    'Pokhara Metropolitan City',
    '2024-02-10',
    1500000,
    true
),
(
    'MC-2024-004',
    'Land Revenue Department Bribery',
    'Systematic bribery in land registration and property tax collection. Officials demanded bribes for routine services, affecting thousands of citizens trying to register property or pay taxes.',
    'ongoing',
    'high',
    200000000.00,
    1650,
    18700,
    720,
    'Lumbini',
    'Bharatpur Metropolitan City',
    '2024-01-05',
    500000,
    true
),
(
    'MC-2024-005',
    'Municipal Water Supply Corruption',
    'Corruption in water supply infrastructure projects. Contractors failed to complete projects but received full payment. Many areas still lack proper water supply despite millions spent.',
    'unsolved',
    'medium',
    300000000.00,
    450,
    8900,
    230,
    'Karnali',
    'Surkhet Municipality',
    '2023-12-15',
    100000,
    true
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_major_cases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_major_cases_updated_at
    BEFORE UPDATE ON major_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_major_cases_updated_at();
