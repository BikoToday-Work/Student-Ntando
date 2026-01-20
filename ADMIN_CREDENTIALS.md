# Admin Login Credentials

## Default Admin Account

**Email:** `admin@bifa.com`  
**Password:** `admin123`  
**Role:** ADMIN

## How to Create Admin User

### Option 1: Run Seed Script (Recommended)

```bash
cd backend
node scripts/seedAdmin.js
```

This will create the admin user in your database.

### Option 2: Manual Database Insert

If you prefer to create the admin manually or use different credentials:

```bash
cd backend
node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('YOUR_PASSWORD', 10).then(hash => console.log(hash));
"
```

Then insert into database using Prisma Studio or SQL.

## Login URL

- **Admin Portal:** http://localhost:3000/admin/login
- **Production:** https://your-domain.com/admin/login

## Security Notes

⚠️ **IMPORTANT:** Change the default password immediately after first login in production!

- Never commit real credentials to Git
- Use strong passwords in production
- Enable 2FA if available
- Rotate credentials regularly

## Testing the Login

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to: http://localhost:3000/admin/login
4. Use the credentials above

## Troubleshooting

If login fails:
- Verify database is running: `docker-compose ps`
- Check if admin user exists: `cd backend && npx prisma studio`
- Re-run seed script: `node scripts/seedAdmin.js`
- Check backend logs for errors
