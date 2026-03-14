#!/bin/bash

echo "Testing Backend Connection..."

# Replace with your actual URLs
BACKEND_URL="https://brics-backend-six.vercel.app"
FRONTEND_URL="https://brics-five.vercel.app"

echo "1. Testing Backend Health:"
curl -s "$BACKEND_URL/" | head -3

echo -e "\n2. Testing API Endpoint:"
curl -s "$BACKEND_URL/api/competitions" | head -3

echo -e "\n3. Testing Login:"
curl -s -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bifa.com","password":"admin123"}' | head -3

echo -e "\n4. Frontend should be accessible at: $FRONTEND_URL"
echo "5. Check browser console for API calls when using the frontend"