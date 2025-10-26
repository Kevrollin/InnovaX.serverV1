#!/bin/bash

# Direct psql migration to Neon database
# Alternative method using psql directly

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}================================${NC}"
echo -e "${PURPLE}  Direct psql Migration${NC}"
echo -e "${PURPLE}================================${NC}"
echo ""

# Database connection string
DB_URL="postgresql://neondb_owner:npg_1rjCN4eJQmPY@ep-wild-morning-a4gz3alv-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ psql is not installed. Please install PostgreSQL client tools.${NC}"
    echo -e "${YELLOW}On Ubuntu/Debian: sudo apt-get install postgresql-client${NC}"
    echo -e "${YELLOW}On macOS: brew install postgresql${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 Running migration using psql...${NC}"
echo -e "${YELLOW}Database: ep-wild-morning-a4gz3alv-pooler.us-east-1.aws.neon.tech${NC}"
echo ""

# Run the migration
psql "$DB_URL" -f migrations/001_initial_schema.sql

echo ""
echo -e "${GREEN}🎉 Migration completed successfully!${NC}"
echo ""
echo -e "${CYAN}📋 Database is now ready with:${NC}"
echo -e "${GREEN}  ✅ All tables created${NC}"
echo -e "${GREEN}  ✅ Indexes optimized${NC}"
echo -e "${GREEN}  ✅ Default admin user${NC}"
echo ""
echo -e "${YELLOW}🔑 Admin credentials: admin / admin123${NC}"
