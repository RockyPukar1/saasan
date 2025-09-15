# Database Seeding Guide

This document explains how to seed the Saasan database with comprehensive test data for development and testing purposes.

## 🚀 Quick Start

```bash
# Seed all data (recommended)
npm run seed:smart

# Or use the reset command
npm run seed:reset
```

## 📋 Available Seeding Scripts

| Script       | Command              | Description                 |
| ------------ | -------------------- | --------------------------- |
| `seed:admin` | `npm run seed:admin` | Creates only admin user     |
| `seed:smart` | `npm run seed:smart` | Smart seeding (recommended) |
| `seed:reset` | `npm run seed:reset` | Alias for smart seeding     |

## 🗄️ Seeded Data

### **Users (5 users)**

- **Admin**: `admin@saasan.com` / `admin123`
- **Investigator**: `officer1@saasan.com` / `officer123`
- **Moderator**: `officer2@saasan.com` / `officer123`
- **Citizen 1**: `citizen1@saasan.com` / `citizen123`
- **Citizen 2**: `citizen2@saasan.com` / `citizen123`

### **Reference Data**

- **3 Levels**: Federal, Provincial, Local
- **5 Political Parties**: NC, UML, MC, RPP, JSP
- **8 Positions**: PM, Minister, MP, CM, etc.
- **8 Constituencies**: Kathmandu, Lalitpur, Pokhara, Chitwan
- **8 Corruption Categories**: Budget Misuse, Bribery, Land Grabbing, etc.

### **Content Data**

- **3 Politicians**: Sher Bahadur Deuba, K P Sharma Oli, Pushpa Kamal Dahal
- **3 Corruption Reports**: Various categories and statuses
- **3 Polls**: Public opinion polls on corruption

## 🔧 How It Works

### Smart Seeding Logic

The `seed:smart` script:

1. **Clears user-generated data** (users, politicians, reports, polls)
2. **Preserves reference data** (levels, parties, positions, etc.)
3. **Checks existing data** before seeding to avoid duplicates
4. **Creates fresh content** for testing

### Data Relationships

```
Users → Corruption Reports (reporter_id)
Users → Corruption Reports (assigned_to_officer_id)
Political Parties → Politicians (party_id)
Positions → Politicians (position_id)
Constituencies → Politicians (constituency_id)
Corruption Categories → Corruption Reports (category_id)
Polls → Poll Options (poll_id)
```

## 🎯 Use Cases

### **Development**

- Test dashboard functionality
- Verify API endpoints
- Check data relationships
- Test user roles and permissions

### **Demo/Testing**

- Present realistic data
- Show different report statuses
- Demonstrate user workflows
- Test mobile app features

### **QA Testing**

- Test with various data scenarios
- Verify edge cases
- Check data validation
- Test performance with sample data

## 🔄 Resetting Data

To reset the database with fresh data:

```bash
# This will clear user data and reseed
npm run seed:smart
```

**Note**: This preserves reference data (levels, parties, etc.) but recreates all user-generated content.

## 📊 Data Statistics

After seeding, you'll have:

- **5 Users** across different roles
- **3 Politicians** with complete profiles
- **3 Corruption Reports** in various states
- **3 Public Polls** with multiple options
- **Complete reference data** for all dropdowns

## 🛠️ Customization

### Adding More Data

To add more test data, edit `/scripts/seed-smart.js`:

1. **Add more users** to the `users` array
2. **Add more politicians** to the `politicians` array
3. **Add more reports** to the `corruptionReports` array
4. **Add more polls** to the `polls` array

### Modifying Existing Data

- Change user credentials in the `users` array
- Update politician information in the `politicians` array
- Modify report details in the `corruptionReports` array

## 🚨 Important Notes

### **Database Requirements**

- PostgreSQL database must be running
- Database connection configured in environment variables
- Proper permissions for table operations

### **Environment Variables**

```bash
DB_HOST=localhost
DBPORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=saasan
```

### **Data Safety**

- Scripts only clear user-generated data
- Reference data is preserved
- Always backup production data before seeding

## 🔍 Troubleshooting

### **Common Issues**

1. **Connection Error**

   ```
   Error: connect ECONNREFUSED
   ```

   - Check if PostgreSQL is running
   - Verify connection settings

2. **Permission Error**

   ```
   Error: permission denied
   ```

   - Check database user permissions
   - Ensure user can create/delete records

3. **Duplicate Key Error**
   ```
   Error: duplicate key value violates unique constraint
   ```
   - Run `seed:smart` instead of other scripts
   - Check if data already exists

### **Verification**

After seeding, verify data:

```sql
-- Check users
SELECT email, role FROM users;

-- Check politicians
SELECT full_name, status FROM politicians;

-- Check reports
SELECT title, status FROM corruption_reports;

-- Check polls
SELECT title FROM polls;
```

## 📝 Script Details

### **seed-smart.js**

- Main seeding script
- Handles existing data gracefully
- Creates comprehensive test dataset
- Safe for development environments

### **seed-admin.js**

- Creates only admin user
- Minimal setup
- Good for quick admin access

## 🎉 Success!

After successful seeding, you can:

1. **Login to dashboard** with admin credentials
2. **Test all features** with realistic data
3. **Verify mobile app** functionality
4. **Demo the platform** to stakeholders

The database is now ready for development and testing! 🚀
