#!/bin/bash

# Test script for Posts API

BASE_URL="http://localhost:8000/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 Testing FundHub Posts API"
echo "================================"
echo ""

# Test 1: Get all posts
echo "1. Testing GET /api/posts"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/posts")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Success${NC} (HTTP $HTTP_CODE)"
else
    echo -e "${RED}❌ Failed${NC} (HTTP $HTTP_CODE)"
fi
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# Test 2: Get posts with filters
echo "2. Testing GET /api/posts?postType=insights"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/posts?postType=insights")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Success${NC} (HTTP $HTTP_CODE)"
else
    echo -e "${RED}❌ Failed${NC} (HTTP $HTTP_CODE)"
fi
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# Test 3: Check Swagger docs
echo "3. Testing Swagger UI"
if curl -s http://localhost:8000/api-docs/ | grep -q "Swagger UI"; then
    echo -e "${GREEN}✅ Swagger UI is accessible${NC}"
    echo "   Visit: http://localhost:8000/api-docs"
else
    echo -e "${RED}❌ Swagger UI not accessible${NC}"
fi
echo ""

# Test 4: Health check
echo "4. Testing Health Check"
RESPONSE=$(curl -s http://localhost:8000/health)
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

echo "================================"
echo "✅ API testing complete!"
echo ""
echo "📚 API Documentation: http://localhost:8000/api-docs"
echo "🔗 API Base URL: http://localhost:8000/api"
