const API_URL = 'http://localhost:5000';

async function testLogin() {
  try {
    console.log('Testing login...');
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@bifa.com',
        password: 'admin123'
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('User:', data.user);
      console.log('Token:', data.token ? 'Present' : 'Missing');
    } else {
      const error = await response.json();
      console.log('❌ Login failed:', error);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

testLogin();