import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Test users for each role
const testUsers = [
  { email: 'admin@test.com', password: 'password123', firstName: 'Admin', lastName: 'User', role: 'ADMIN' },
  { email: 'secretary@test.com', password: 'password123', firstName: 'Secretary', lastName: 'User', role: 'SECRETARIAT' },
  { email: 'referee@test.com', password: 'password123', firstName: 'Referee', lastName: 'User', role: 'REFEREE' },
  { email: 'manager@test.com', password: 'password123', firstName: 'Manager', lastName: 'User', role: 'TEAM_MANAGER' },
  { email: 'federation@test.com', password: 'password123', firstName: 'Federation', lastName: 'User', role: 'FEDERATION_OFFICIAL' }
];

async function testAuth() {
  console.log('🧪 Testing BIFA Authentication & RBAC System\n');

  // 1. Register test users
  console.log('1️⃣ Registering test users...');
  for (const user of testUsers) {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const result = await response.json();
      console.log(`✅ ${user.role}: ${user.email} registered`);
    } catch (error) {
      console.log(`❌ ${user.role}: Registration failed - ${error.message}`);
    }
  }

  console.log('\n2️⃣ Testing login and role-based access...');
  
  // 2. Test login and RBAC for each user
  for (const user of testUsers) {
    try {
      // Login
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: user.password })
      });
      
      if (!loginResponse.ok) {
        console.log(`❌ ${user.role}: Login failed`);
        continue;
      }
      
      const loginResult = await loginResponse.json();
      const token = loginResult.token;
      console.log(`✅ ${user.role}: Login successful`);

      // Test role-specific endpoints
      const roleEndpoints = {
        'ADMIN': ['/users', '/admin/dashboard'],
        'SECRETARIAT': ['/secretariat/competitions'],
        'REFEREE': ['/referee/matches'],
        'TEAM_MANAGER': ['/team-manager/squad'],
        'FEDERATION_OFFICIAL': ['/federation/overview']
      };

      const endpoints = roleEndpoints[user.role] || [];
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            console.log(`  ✅ ${endpoint}: Access granted`);
          } else {
            console.log(`  ❌ ${endpoint}: Access denied (${response.status})`);
          }
        } catch (error) {
          console.log(`  ❌ ${endpoint}: Error - ${error.message}`);
        }
      }

      // Test unauthorized access (admin endpoint for non-admin)
      if (user.role !== 'ADMIN') {
        try {
          const response = await fetch(`${API_BASE}/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.status === 403) {
            console.log(`  ✅ Admin endpoint: Correctly blocked for ${user.role}`);
          } else {
            console.log(`  ❌ Admin endpoint: Should be blocked for ${user.role}`);
          }
        } catch (error) {
          console.log(`  ❌ Admin endpoint test failed: ${error.message}`);
        }
      }

    } catch (error) {
      console.log(`❌ ${user.role}: Test failed - ${error.message}`);
    }
    console.log('');
  }

  console.log('🎉 RBAC Testing Complete!');
}

// Run tests
testAuth().catch(console.error);