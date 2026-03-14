# Quick Login Guide - No Supabase Auth Required

## Mock Authentication Enabled

The system now supports mock authentication for testing without Supabase Auth setup.

## Login Credentials

### Super Admin
- **Email:** `admin@bifa.org`
- **Password:** Any password (e.g., `password`)
- **Access:** Full system access

### Federation Admin
- **Email:** `federation@bifa.org`
- **Password:** Any password
- **Access:** Create competitions, approve entries, manage teams

### Team Managers

| Team | Email | Password | Country |
|------|-------|----------|---------|
| Flamengo | `tite@flamengo.br` | Any | Brazil |
| Palmeiras | `abel@palmeiras.br` | Any | Brazil |
| Zenit St Petersburg | `semak@zenit.ru` | Any | Russia |
| Mumbai City FC | `des@mumbaicity.in` | Any | India |
| Shanghai Port | `wu@shanghaiport.cn` | Any | China |
| Mamelodi Sundowns | `rulani@sundowns.co.za` | Any | South Africa |

## How It Works

1. Go to `/login`
2. Enter any email from the list above
3. Enter any password (it's ignored for mock users)
4. Click Login
5. You're authenticated!

## What Each Role Can Do

### Super Admin
- ✅ Everything
- ✅ Manage users
- ✅ View audit logs
- ✅ Issue sanctions

### Federation Admin
- ✅ Create competitions
- ✅ Approve competition entries
- ✅ Manage teams and players
- ✅ Register referees
- ❌ Cannot access super admin features

### Team Manager
- ✅ View their team dashboard
- ✅ See team stats and players
- ✅ Request competition entries
- ✅ View squad information
- ❌ Cannot approve entries
- ❌ Cannot see other teams

## Testing Workflow

### Test Competition Entry Flow:
1. Login as `federation@bifa.org`
2. Create a competition
3. Logout
4. Login as `tite@flamengo.br`
5. Go to Teams → Request Competition Entry
6. Select Flamengo and the competition
7. Submit request
8. Logout
9. Login as `federation@bifa.org`
10. Go to Competition Entries
11. Approve the request

### Test Player Transfer:
1. Login as `federation@bifa.org`
2. Go to Player Transfer
3. Select a player
4. Choose destination team
5. Complete transfer
6. Check player's new team

## Player Transfer Fix

Fixed issues:
- ✅ Removed `status='active'` filter (column doesn't exist)
- ✅ Simplified transfer logic
- ✅ Better error handling
- ✅ Handles null team_id values
- ✅ Shows detailed error messages

## Adding More Mock Users

Edit `src/context/AuthContext.tsx`:

```typescript
const mockUsers: Record<string, { name: string; role: UserRole; country: string; timezone: string }> = {
  'newemail@example.com': { 
    name: 'New User', 
    role: 'team_manager', 
    country: 'Brazil', 
    timezone: 'America/Sao_Paulo' 
  },
  // ... add more
};
```

## Switching to Real Supabase Auth

When ready for production:
1. Set up Supabase Auth users
2. Remove mock user logic from AuthContext
3. Users will authenticate via Supabase
4. All features work the same way

## Notes

- Mock auth is for development/demo only
- No passwords are stored or checked
- Session persists until logout
- Works offline without database
- Perfect for testing and demos
