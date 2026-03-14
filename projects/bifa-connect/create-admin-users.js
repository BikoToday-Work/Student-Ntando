// Create Admin Users Script
// Run this in browser console on your deployed site or locally

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const adminUsers = [
  {
    email: 'admin@bifa.int',
    password: 'admin123',
    name: 'Luyolo Badla',
    role: 'super_admin',
    country: 'South Africa',
    timezone: 'Africa/Johannesburg'
  },
  {
    email: 'fed@bifa.int',
    password: 'fed123',
    name: 'Danny Anderson',
    role: 'federation_admin',
    country: 'India',
    timezone: 'Asia/Kolkata'
  },
  {
    email: 'sec@bifa.int',
    password: 'sec123',
    name: 'Ivan Petrov',
    role: 'secretariat_officer',
    country: 'Russia',
    timezone: 'Europe/Moscow'
  },
  {
    email: 'mgr@bifa.int',
    password: 'mgr123',
    name: 'Carlos Roberto',
    role: 'team_manager',
    country: 'Brazil',
    timezone: 'America/Sao_Paulo'
  }
];

async function createAdminUsers() {
  for (const user of adminUsers) {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          data: {
            name: user.name,
            role: user.role,
            country: user.country,
            timezone: user.timezone
          }
        })
      });
      
      const data = await response.json();
      console.log(`✓ Created: ${user.email}`, data);
    } catch (error) {
      console.error(`✗ Failed: ${user.email}`, error);
    }
  }
  
  console.log('\n⚠️ IMPORTANT: Update roles in database:');
  console.log('Run this SQL in Supabase:');
  console.log(`
UPDATE users SET role = 'super_admin' WHERE email = 'admin@bifa.int';
UPDATE users SET role = 'federation_admin' WHERE email = 'fed@bifa.int';
UPDATE users SET role = 'secretariat_officer' WHERE email = 'sec@bifa.int';
UPDATE users SET role = 'team_manager' WHERE email = 'mgr@bifa.int';
  `);
}

// Run it
createAdminUsers();
