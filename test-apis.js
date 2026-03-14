const API_URL = 'http://localhost:5000';

// Test authentication and get token
async function testAuth() {
  console.log('🔐 Testing Authentication...');

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@bifa.com',
        password: 'admin123'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful');
      return data.token;
    } else {
      console.log('❌ Login failed');
      return null;
    }
  } catch (error) {
    console.log('❌ Auth error:', error.message);
    return null;
  }
}

// Test CMS endpoints
async function testCMS(token) {
  console.log('\n📝 Testing CMS APIs...');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Test create page
  try {
    const pageResponse = await fetch(`${API_URL}/api/cms/pages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Test Page',
        slug: 'test-page',
        content: 'This is a test page content',
        status: 'PUBLISHED'
      })
    });

    if (pageResponse.ok) {
      console.log('✅ Page creation successful');
    } else {
      console.log('❌ Page creation failed');
    }
  } catch (error) {
    console.log('❌ CMS error:', error.message);
  }

  // Test get pages
  try {
    const pagesResponse = await fetch(`${API_URL}/api/cms/pages`);
    if (pagesResponse.ok) {
      const pages = await pagesResponse.json();
      console.log(`✅ Retrieved ${pages.length} pages`);
    }
  } catch (error) {
    console.log('❌ Get pages error:', error.message);
  }
}

// Test Governance endpoints
async function testGovernance(token) {
  console.log('\n🏛️ Testing Governance APIs...');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Test create task
  try {
    const taskResponse = await fetch(`${API_URL}/api/governance/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Test Task',
        description: 'This is a test secretariat task',
        assignedRole: 'SECRETARIAT',
        priority: 'MEDIUM'
      })
    });

    if (taskResponse.ok) {
      console.log('✅ Task creation successful');
    } else {
      console.log('❌ Task creation failed');
    }
  } catch (error) {
    console.log('❌ Governance error:', error.message);
  }
}

// Test Referee endpoints
async function testReferee(token) {
  console.log('\n👨‍⚖️ Testing Referee APIs...');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Test get referees
  try {
    const refereesResponse = await fetch(`${API_URL}/api/referees`, { headers });
    if (refereesResponse.ok) {
      const referees = await refereesResponse.json();
      console.log(`✅ Retrieved ${referees.length} referees`);
    } else {
      console.log('❌ Get referees failed');
    }
  } catch (error) {
    console.log('❌ Referee error:', error.message);
  }
}

// Test Disciplinary endpoints
async function testDisciplinary(token) {
  console.log('\n⚠️ Testing Disciplinary APIs...');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Test get reports
  try {
    const reportsResponse = await fetch(`${API_URL}/api/disciplinary-reports`, { headers });
    if (reportsResponse.ok) {
      const reports = await reportsResponse.json();
      console.log(`✅ Retrieved ${reports.length} disciplinary reports`);
    } else {
      console.log('❌ Get reports failed');
    }
  } catch (error) {
    console.log('❌ Disciplinary error:', error.message);
  }
}

// Test Admin Dashboard endpoint
async function testAdminDashboard(token) {
  console.log('\n📊 Testing Admin Stats API...');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const statsResponse = await fetch(`${API_URL}/api/admin/stats`, { headers });
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Retrieved admin dashboard stats:', stats);
    } else {
      const errorText = await statsResponse.text();
      console.log(`❌ Get admin stats failed (${statsResponse.status}): ${errorText}`);
    }
  } catch (error) {
    console.log('❌ Admin stats request error:', error.message);
  }
}

// Test Competitions endpoint
async function testCompetitions() {
  console.log('\n🏆 Testing Competitions API...');
  try {
    const response = await fetch(`${API_URL}/api/competitions`);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Retrieved ${data.length} competitions`);
      if (data.length > 0) {
        console.log('Sample Competition:', data[0].name);
      }
    } else {
      console.log(`❌ Competitions fetch failed: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Competitions error:', error.message);
  }
}

// Test Teams endpoint
async function testTeams() {
  console.log('\n⚽ Testing Teams API...');
  try {
    const response = await fetch(`${API_URL}/api/teams`);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Retrieved ${data.length} teams`);
      if (data.length > 0) {
        console.log('Sample Team:', data[0].name);
      }
    } else {
      console.log(`❌ Teams fetch failed: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Teams error:', error.message);
  }
}


// Run all tests
async function runTests() {
  console.log('🚀 Starting BIFA Platform API Tests\n');

  // Test health check
  try {
    const healthResponse = await fetch(`${API_URL}/`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('✅ Backend is running:', health.message);
    }
  } catch (error) {
    console.log('❌ Backend not accessible:', error.message);
    return;
  }

  const token = await testAuth();
  if (!token) {
    console.log('❌ Cannot proceed without authentication token');
    return;
  }

  await testCMS(token);
  await testGovernance(token);
  await testReferee(token);
  await testDisciplinary(token);
  await testAdminDashboard(token);

  // New Football API Tests
  await testCompetitions();
  await testTeams();

  console.log('\n🎉 API Tests Complete!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests();
}

module.exports = { runTests };