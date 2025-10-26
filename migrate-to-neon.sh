#!/bin/bash

# Neon Database Migration Script
# This script runs the database migration to your Neon PostgreSQL database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}================================${NC}"
echo -e "${PURPLE}  Neon Database Migration${NC}"
echo -e "${PURPLE}================================${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing required dependencies...${NC}"
npm install pg

echo ""
echo -e "${BLUE}🚀 Running database migration...${NC}"
echo -e "${YELLOW}Database URL: postgresql://neondb_owner:***@ep-wild-morning-a4gz3alv-pooler.us-east-1.aws.neon.tech/neondb${NC}"
echo ""

# Set the database URL environment variable
export DATABASE_URL="postgresql://neondb_owner:npg_1rjCN4eJQmPY@ep-wild-morning-a4gz3alv-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Run the migration
node run-migration.js

echo ""
echo -e "${GREEN}🎉 Migration completed successfully!${NC}"
echo ""
echo -e "${CYAN}📋 What was created:${NC}"
echo -e "${GREEN}  ✅ Users table${NC}"
echo -e "${GREEN}  ✅ Students table${NC}"
echo -e "${GREEN}  ✅ Projects table${NC}"
echo -e "${GREEN}  ✅ Milestones table${NC}"
echo -e "${GREEN}  ✅ Campaigns table${NC}"
echo -e "${GREEN}  ✅ Donations table${NC}"
echo -e "${GREEN}  ✅ Posts table${NC}"
echo -e "${GREEN}  ✅ Wallets table${NC}"
echo -e "${GREEN}  ✅ All necessary indexes${NC}"
echo -e "${GREEN}  ✅ Default admin user${NC}"
echo ""
echo -e "${YELLOW}🔑 Default admin credentials:${NC}"
echo -e "${YELLOW}  Username: admin${NC}"
echo -e "${YELLOW}  Password: admin123${NC}"
echo ""
echo -e "${BLUE}🔗 You can now connect your Express backend to this database!${NC}"
