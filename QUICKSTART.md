# TradieBear V6 - Quick Start Guide

Get your TradieBear app running in under 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

The `.env.local` file should already exist with your Supabase credentials. If not, create it:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://hrymdzhmcizajjruofoy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 First Steps

### Create an Admin User

1. Go to your Supabase project dashboard
2. Navigate to Authentication → Users
3. Create a new user or use an existing one
4. Go to Table Editor → `profiles` table
5. Update the user's `role` to `'admin'`

### Add Services

Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO services (name, description, is_active) VALUES
('Plumbing', 'Residential plumbing services', true),
('Electrical', 'Electrical work and repairs', true),
('HVAC', 'Heating and cooling services', true);
```

### Create a Referral Link

```sql
INSERT INTO referral_links (user_id, slug, is_active)
VALUES (
  'your-user-uuid',  -- Replace with actual user UUID
  'test-partner',
  true
);
```

### Test the Flow

1. **Login**: Visit `http://localhost:3000/login`
   - Email: your-admin-email
   - Password: your-password

2. **View Admin Dashboard**: You'll be redirected to `/admin`
   - Browse through all tabs
   - No data yet? That's normal!

3. **Test Referral Form**: Visit `http://localhost:3000/r/test-partner`
   - Fill out the form
   - Upload some test images
   - Submit

4. **Check Admin Dashboard**: Refresh `/admin`
   - Go to "Leads" tab
   - See your test submission!

## 📋 What's Included?

### ✅ Pages
- `/` - Home (auto-redirect)
- `/login` - Admin login
- `/r/[slug]` - Public referral forms
- `/admin` - Dashboard with 5 tabs

### ✅ Admin Tabs
1. **Leads** - View & manage submissions
2. **Services** - Toggle active services
3. **Areas** - Define service areas
4. **Commissions** - Manage commission tiers
5. **Support** - Handle support tickets

### ✅ Features
- 🔐 Secure authentication with Supabase
- 🌙 Dark/light mode toggle
- 📱 Fully responsive design
- 🖼️ Image upload (up to 10 images)
- 📊 Lead stage tracking
- 🎨 Beautiful UI with shadcn/ui

## 🔧 Common Tasks

### Add a New Service

Via Supabase SQL Editor:
```sql
INSERT INTO services (name, description, is_active)
VALUES ('New Service', 'Description here', true);
```

### Create Partner Referral Link

```sql
INSERT INTO referral_links (user_id, slug, is_active)
VALUES ('partner-user-uuid', 'partner-name', true);
```

Link will be: `/r/partner-name`

### Add Commission Tiers

```sql
INSERT INTO commission_tiers (min_amount, max_amount, percentage)
VALUES
(0, 5000, 10.0),      -- 10% for $0-$5k
(5001, 15000, 12.5),  -- 12.5% for $5k-$15k
(15001, NULL, 15.0);  -- 15% for $15k+
```

## 🐛 Troubleshooting

### "Can't connect to Supabase"
- Check your `.env.local` file
- Verify Supabase URL and keys are correct
- Make sure you're running `npm run dev`

### "Access Denied" when logging in
- Verify user exists in `profiles` table
- Check that `role = 'admin'`
- Clear browser cookies and try again

### Referral link shows 404
- Verify the referral link exists in database
- Check `is_active = true`
- Ensure slug matches URL

### Images not uploading
- Create `lead-attachments` storage bucket in Supabase
- Set bucket to public
- Check file size < 10 MB

## 📱 Test Data Generator

Want to populate with test data? Run this in Supabase:

```sql
-- Insert test lead
INSERT INTO leads (
  referral_link_id,
  service_id,
  name,
  email,
  phone,
  street,
  city,
  state,
  zip,
  timeline,
  stage
) VALUES (
  (SELECT id FROM referral_links LIMIT 1),
  (SELECT id FROM services LIMIT 1),
  'John Doe',
  'john@example.com',
  '555-0123',
  '123 Main St',
  'San Francisco',
  'CA',
  '94102',
  'Within 2 weeks',
  'new'
);
```

## 🚢 Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions to Vercel.

## 📚 Learn More

- [Full README](./README.md) - Complete documentation
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 💡 Tips

1. **Use Dark Mode**: Toggle with the moon/sun icon in the header
2. **Keyboard Navigation**: Most forms support tab navigation
3. **Filters**: Use the search and filter options in the Leads tab
4. **Stage Management**: Click on stage badges to update lead status
5. **Bulk Actions**: Coming in future updates!

---

**Happy building!** 🎉

If you need help, check the full README or open an issue on GitHub.

